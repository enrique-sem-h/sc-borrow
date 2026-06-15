import BaseController from "./base-controller";
import auth from "../middlewares/auth";
import { NextAuthApiRequest } from "../types";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { validate } from "../middlewares/validate";
import { pagamentoSchema } from "@/modules/zod/schemas/pagamentoSchema";
import AluguelService from "../services/aluguel-service";
import { CreateAluguelDTO } from "../types";
import { buffer } from "stream/consumers";

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

      const aluguelDTO = {
        dataFim: new Date(data.dataFim),
        dataInicio: new Date(data.dataInicio),
        idAnuncio: data.idAnuncio,
        idLocador: data.userId,
        idLocatario: data.idLocatario,
        valorTotal: intent.amount / 100,
      } as CreateAluguelDTO;

      const aluguel = await this.aluguelService.create(aluguelDTO);

      if (aluguel) {
        res.status(200).json({ message: "aluguel created!", aluguel });
      }
    }

    return res.status(200).json({ received: true });
  }
}

export default CheckoutController;
