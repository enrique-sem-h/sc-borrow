import BaseController from "./base-controller";
import auth from "../middlewares/auth";
import { NextAuthApiRequest } from "../types";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { validate } from "../middlewares/validate";
import { pagamentoSchema } from "@/modules/zod/schemas/pagamentoSchema";
import AluguelService from "../services/aluguel-service";
import AluguelRepository from "../repositories/aluguel-repository";
import { CreateAluguelDTO } from "../types";
import { buffer } from "stream/consumers";
import { db } from "@/infra/database";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { eq } from "drizzle-orm";
import UserRepository from "../repositories/user-repository";
import { dbFirebase } from "@/infra/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

class CheckoutController extends BaseController {
  private aluguelService = new AluguelService();

  constructor() {
    super();
    this.use(auth);
  }

  public createIntent(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(
      req,
      res,
      validate({ body: pagamentoSchema }),
      async () => {
        try {
          const conflito = await AluguelRepository.findConflictAnuncio(
            req.body.idAnuncio,
            new Date(req.body.dataInicio),
            new Date(req.body.dataFim),
          );

          if (conflito) {
            return res.status(409).json({
              error:
                "Este anúncio já está reservado para as datas selecionadas.",
            });
          }

          const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.valor,
            currency: "brl",
            payment_method_types: ["card"],
            metadata: {
              userId: req.userId,
              dataInicio: req.body.dataInicio,
              dataFim: req.body.dataFim,
              idAnuncio: req.body.idAnuncio,
              idLocatario: req.body.idLocatario,
            },
          });

          return res
            .status(200)
            .json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Erro ao criar sessao de checkout" });
        }
      },
    );
  }

  public async finalize(req: NextAuthApiRequest, res: NextApiResponse) {
    return this.handleRequest(req, res, async () => {
      try {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) {
          return res.status(400).json({ error: "paymentIntentId obrigatório" });
        }

        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (intent.status !== "succeeded") {
          return res.status(400).json({ error: "Pagamento não confirmado" });
        }

        const data = intent.metadata;
        const [anuncio] = await db
          .select()
          .from(anuncios)
          .where(eq(anuncios.id, data.idAnuncio))
          .limit(1);

        const idLocador = anuncio?.usuarioId;
        if (!idLocador) {
          return res.status(400).json({ error: "Anúncio não encontrado" });
        }

        const aluguelDTO = {
          dataFim: new Date(data.dataFim),
          dataInicio: new Date(data.dataInicio),
          idAnuncio: data.idAnuncio,
          idLocador,
          idLocatario: data.idLocatario,
          valorTotal: intent.amount / 100,
        } as CreateAluguelDTO;

        let aluguel;
        try {
          aluguel = await this.aluguelService.create(aluguelDTO);
        } catch (err) {
          console.warn("Aluguel possivelmente já existe:", err.message);
          return res.status(200).json({ message: "already exists" });
        }

        if (aluguel) {
          try {
            const conversasRef = collection(dbFirebase, "conversas");
            const existing = await getDocs(
              query(conversasRef, where("idAluguel", "==", aluguel.id)),
            );

            if (existing.empty) {
              const [locador, locatario] = await Promise.all([
                UserRepository.read(idLocador),
                UserRepository.read(data.idLocatario),
              ]);
              const periodo = `${new Date(data.dataInicio).toLocaleDateString("pt-BR")} - ${new Date(data.dataFim).toLocaleDateString("pt-BR")}`;

              await addDoc(conversasRef, {
                idAluguel: aluguel.id,
                idAnuncio: data.idAnuncio,
                idLocador,
                idLocatario: data.idLocatario,
                nomeLocador: locador?.nome || "Proprietário",
                nomeLocatario: locatario?.nome || "Locatário",
                participantes: [idLocador, data.idLocatario],
                itemAcordo: anuncio.titulo,
                periodoAcordo: periodo,
                ultimaMensagem: "",
                naoLidas: {},
                criadoEm: serverTimestamp(),
              });
            }
          } catch (err) {
            console.error("Erro ao criar conversa no Firestore:", err);
          }
          return res.status(200).json({ aluguelId: aluguel.id });
        }

        return res.status(500).json({ error: "Erro ao criar aluguel" });
      } catch (err) {
        console.error("Erro no finalize:", err);
        return res.status(500).json({ error: "Erro interno" });
      }
    });
  }

  public async stripeResponse(req: NextApiRequest, res: NextApiResponse) {
    const rawBody = await buffer(req);
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(401).json({ error: "invalid signature" });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret!,
      );
    } catch (error) {
      console.log(`Webhook Error: ${error}`);

      return res.status(500).json({ error: `Webhook Error: ${error}` });
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      const data = intent.metadata;

      const [anuncio] = await db
        .select()
        .from(anuncios)
        .where(eq(anuncios.id, data.idAnuncio))
        .limit(1);

      const idLocador = anuncio?.usuarioId;
      if (!idLocador) {
        return res.status(400).json({ error: "Anúncio não encontrado" });
      }

      const aluguelDTO = {
        dataFim: new Date(data.dataFim),
        dataInicio: new Date(data.dataInicio),
        idAnuncio: data.idAnuncio,
        idLocador,
        idLocatario: data.idLocatario,
        valorTotal: intent.amount / 100,
      } as CreateAluguelDTO;

      let aluguel;
      try {
        aluguel = await this.aluguelService.create(aluguelDTO);
      } catch (err) {
        console.error("Erro ao criar aluguel no webhook:", err);
        return res.status(200).json({ received: true });
      }

      if (aluguel) {
        try {
          const conversasRef = collection(dbFirebase, "conversas");
          const existing = await getDocs(
            query(conversasRef, where("idAluguel", "==", aluguel.id)),
          );

          if (existing.empty) {
            const [locador, locatario] = await Promise.all([
              UserRepository.read(idLocador),
              UserRepository.read(data.idLocatario),
            ]);

            const periodo = `${new Date(data.dataInicio).toLocaleDateString("pt-BR")} - ${new Date(data.dataFim).toLocaleDateString("pt-BR")}`;

            await addDoc(conversasRef, {
              idAluguel: aluguel.id,
              idAnuncio: data.idAnuncio,
              idLocador,
              idLocatario: data.idLocatario,
              nomeLocador: locador?.nome || "Proprietário",
              nomeLocatario: locatario?.nome || "Locatário",
              participantes: [idLocador, data.idLocatario],
              itemAcordo: anuncio.titulo,
              periodoAcordo: periodo,
              ultimaMensagem: "",
              naoLidas: {},
              criadoEm: serverTimestamp(),
            });
          }
        } catch (err) {
          console.error("Erro ao criar conversa no Firestore:", err);
        }

        return res.status(200).json({ message: "aluguel created!", aluguel });
      }
    }

    return res.status(200).json({ received: true });
  }
}

export default CheckoutController;
