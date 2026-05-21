import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base-controller";
import AnuncioService from "../services/anuncio-service";
import { CreateAnuncioDTO } from "../types";
import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { eror } from "console";

class AnuncioController extends BaseController {
  private anuncioService = new AnuncioService();

  public create(req: NextApiRequest, res: NextApiResponse) {
    // Fazer a validação dos dados
    if (!req.body.usuario) {
      res.status(401).json({ error: "usuário não autorizado" });
      return;
    }
    if (!req.body.titulo) {
      res.status(400).json({ error: "Tente novamente! Título não preenchido" });
      return;
    }
    if (!req.body.descricao) {
      res
        .status(400)
        .json({ error: "Tente novamente! Descrição não preenchida" });
      return;
    }
    if (
      !req.body.categoria ||
      !(anuncios.categoria.enumValues as any).includes(req.body.categoria)
    ) {
      res.status(400).json({
        error: "Tente novamente! Categoria não preenchida ou inválida",
      });
      return;
    }
    if (!req.body.valorDiario || req.body.valorDiario < 0) {
      res
        .status(400)
        .json({ error: "Tente novamente! Valor não preenchido ou inválido" });
      return;
    }
    if (!req.body.caucao || req.body.caucao < 0) {
      res.status(400).json({
        error: "Tente novamente! Valor cação não preenchido ou inválido",
      });
      return;
    }

    const anuncioDto = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      categoria: req.body.categoria,
      valorDiario: req.body.valorDiario,
      caucao: req.body.caucao,
      usuarioId: req.body.usuario.id,
    } as CreateAnuncioDTO;
    console.log("create: ", this.anuncioService);

    const anuncio = this.anuncioService.create(anuncioDto);

    res.send({
      data: {
        ...anuncio,
      },
    });
  }

  public update(req: NextApiRequest, res: NextApiResponse) {}

  public async read(req: NextApiRequest, res: NextApiResponse) {
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

  public delete(req: NextApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const id = req.query.id as string;

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
