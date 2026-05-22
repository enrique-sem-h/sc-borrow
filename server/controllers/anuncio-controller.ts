import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base-controller";
import AnuncioService from "../services/anuncio-service";
import { CreateAnuncioDTO, userParse } from "../types";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import auth, { NextAuthApiRequest } from "../middlewares/auth";
import { error, log } from "console";
import formidable from "formidable";

class AnuncioController extends BaseController {
  private anuncioService = new AnuncioService();

  constructor() {
    super();
    this.use(auth);
  }

  public async create(req: NextAuthApiRequest, res: NextApiResponse) {
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
        console.log(files, fields);

        const fotos = [files.fotos].flat().filter(Boolean) as formidable.File[];
        const titulo = getField("titulo");
        const descricao = getField("descricao");
        const categoria = getField("categoria");
        const valorDiario = Number(getField("valorDiario"));
        const caucao = Number(getField("caucao"));
        console.log(files["fotos[]"]);

        if (fotos.length < 3)
          return fail("Tente novamente! Fotos não preenchidas ou inválidas");
        if (!titulo) return fail("Tente novamente! Título não preenchido");
        if (!descricao)
          return fail("Tente novamente! Descricao nao preenchida");
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

        const anuncioDto = {
          titulo,
          descricao,
          categoria,
          valorDiario,
          caucao,
          usuarioId: req.userId,
        } as CreateAnuncioDTO;

        console.log("anuncioDto", anuncioDto);

        const anuncio = await this.anuncioService.create(anuncioDto, fotos);

        return res.status(201).json({ data: anuncio });
      } catch (error: Error) {
        return fail(error.message, 500);
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
      } catch (err: Error) {
        console.log(err.message);

        res.send({
          error: err.message,
        });
        res.status(500);
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
      } catch (err: Error) {
        console.log(err.message);

        res.send({
          error: err.message,
        });
        res.status(500);
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
      } catch (err: Error) {
        console.log(err.message);

        res.send({
          error: err.message,
        });
        res.status(500);
      }
    });
  }
}

export default AnuncioController;
