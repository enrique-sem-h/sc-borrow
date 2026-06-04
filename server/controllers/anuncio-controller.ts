import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base-controller";
import AnuncioService from "../services/anuncio-service";
import { CreateAnuncioDTO, NextAuthApiRequest } from "../types";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import auth from "../middlewares/auth";
import { error, log } from "console";
import formidable from "formidable";

class AnuncioController extends BaseController {
  private anuncioService = new AnuncioService();

  constructor() {
    super();
    this.use(auth);
  }

  public async create(req: NextAuthApiRequest, res: NextApiResponse) {
    console.log(req);

    this.handleRequest(req, res, async () => {
      // Fazer a validação dos dados
      const form = formidable({
        multiples: true,
        keepExtensions: true,
      });

      const fail = (msg: string, status = 400) => {
        res.status(status).json({ error: msg });
      };

      try {
        const [fields, files] = await form.parse(req);

        const getField = (key: string) =>
          Array.isArray(fields[key]) ? fields[key]?.[0] : fields[key];

        const fotos = [files.fotos].flat().filter(Boolean) as formidable.File[];
        const titulo = getField("titulo");
        const descricao = getField("descricao");
        const categoria = getField(
          "categoria",
        ) as CreateAnuncioDTO["categoria"];
        const valorDiario = Number(getField("valorDiario"));
        const caucao = Number(getField("caucao"));

        if (fotos.length < 3)
          return fail("Tente novamente! Fotos não preenchidas ou inválidas");
        if (!titulo) return fail("Tente novamente! Título não preenchido");
        if (!descricao)
          return res
            .status(400)
            .json({ message: "Tente novamente! Descricao nao preenchida" });
        if (
          !categoria ||
          !(anuncios.categoria.enumValues as any).includes(categoria)
        ) {
          return fail("Tente novamente! Categoria não preenchida ou inválida");
        }
        if (!valorDiario || Number(valorDiario) < 0)
          return fail("Tente novamente! Valor não preenchido ou inválido");
        if (!caucao || Number(caucao) < 0)
          return fail(
            "Tente novamente! Valor cação não preenchido ou inválido",
          );

        const anuncioDto: CreateAnuncioDTO = {
          titulo,
          descricao,
          categoria,
          valorDiario,
          caucao,
          fotos,
        };

        const anuncio = await this.anuncioService.create(
          anuncioDto,
          req.userId,
        );

        return res.status(201).json({ data: anuncio });
      } catch (error) {
        console.error(error);
        return fail("Erro interno", 500);
      }
    });
  }

  public update(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const id = req.query.id as string;

        const newData = req.body;
        newData.usuarioId = undefined;

        const anuncio = await this.anuncioService.read(id);

        if (!anuncio) {
          return res.status(404).send("Anuncio not found");
        }

        if (anuncio.usuarioId !== req.userId) {
          return res
            .status(403)
            .send("User doesn't have permission to edit this anuncio");
        }

        const updated = await this.anuncioService.update(id, newData);

        res.send({
          data: { ...updated },
        });
      } catch (err) {
        console.error(error);
        return res.status(500).json("Erro interno");
      }
    });
  }

  public async read(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const id = req.query.id as string;

        const anuncio = await this.anuncioService.read(id);

        if (!anuncio) {
          res.status(404);
          res.send({
            error: "No anuncio found with this id",
          });
          return;
        }

        const anuncioUserId = anuncio.usuarioId;
        if (anuncioUserId !== req.userId) {
          return res
            .status(403)
            .send("You don't have permission to get this anuncio");
        }

        res.send({
          data: anuncio,
        });
      } catch (err) {
        console.error(err);

        res.status(500).send({
          error: "Erro interno",
        });
      }
    });
  }

  public delete(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const id = req.query.id as string;

        const anuncio = await this.anuncioService.read(id);

        if (!anuncio) {
          res.status(404);
          res.send({
            error: "No anuncio found with this id",
          });
          return;
        }

        const anuncioUserId = anuncio.usuarioId;
        if (anuncioUserId !== req.userId) {
          return res
            .status(403)
            .send("You don't have permission to get this anuncio");
        }

        await this.anuncioService.delete(id);

        res.send("Anuncio deleted successfully");
      } catch (err) {
        console.error(err);

        res.status(500).json({ error: "Erro Interno" });
      }
    });
  }
}

export default AnuncioController;
