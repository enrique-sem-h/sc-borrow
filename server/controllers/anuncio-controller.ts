import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base-controller";
import AnuncioService from "../services/anuncio-service";
import {
  CreateAnuncioDTO,
  NextAuthApiRequest,
  NextFormApiRequest,
} from "../types";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import auth from "../middlewares/auth";
import { error, log } from "console";
import formidable from "formidable";
import { parseForm } from "../middlewares/parseForm";
import { validate } from "../middlewares/validate";
import {
  FileValidationSchema,
  insertAnuncioSchema,
} from "@/modules/zod/schemas/anunciosSchemas";

class AnuncioController extends BaseController {
  private anuncioService = new AnuncioService();

  constructor() {
    super();
    this.use(auth);
  }

  public async getAll(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const userId = req.userId;

        const anuncios = await this.anuncioService.getAll(userId);

        return res.send({
          data: {
            anuncios: [...anuncios],
          },
        });
      } catch (error) {
        console.error(error.message);
        return res.send({
          error: "Error when getting anuncios",
        });
      }
    });
  }

  public async create(
    req: NextAuthApiRequest & NextFormApiRequest,
    res: NextApiResponse,
  ) {
    this.handleRequest(
      req,
      res,
      parseForm,
      validate({ body: insertAnuncioSchema, files: FileValidationSchema }),
      async () => {
        if (req.files!.fotos === undefined) {
          return res.status(500).json({ err: "Failed to fetch photos" });
        }

        const files = req.files!.fotos.flat().filter(Boolean);

        const anuncioDto = {
          ...req.body,
          fotos: files,
        } as CreateAnuncioDTO;

        const anuncio = await this.anuncioService.create(
          anuncioDto,
          req.userId,
        );

        return res.status(201).json({ data: anuncio });
      },
    );
  }

  public update(req: NextAuthApiRequest & NextFormApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, parseForm, async () => {
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

        const fotos = req.files?.fotos
        ? req.files.fotos.flat().filter(Boolean)
        : undefined;

        const fotosParaDeletar = req.body.fotosParaDeletar
        ? JSON.parse(req.body.fotosParaDeletar)
        : [];

        delete newData.fotosParaDeletar;

        const updated = await this.anuncioService.update(id, newData, fotos, fotosParaDeletar);

        res.send({
          data: { ...updated },
        });
      } catch (err) {
        console.error(err);
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
