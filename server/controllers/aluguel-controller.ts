import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base-controller";
import AluguelService from "../services/aluguel-service";
import AnuncioService from "../services/anuncio-service";
import { CreateAluguelDTO, NextAuthApiRequest } from "../types";
import { alugueis } from "@/infra/database/schemas/alugueisSchema";
import auth from "../middlewares/auth";

class AluguelController extends BaseController {
  private aluguelService = new AluguelService();
  private anuncioService = new AnuncioService();

  constructor() {
    super();
    this.use(auth);
  }

  public async create(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      // Fazer a validação dos dados
      const fail = (msg: string, status = 400) => {
        res.status(status).json({ error: msg });
      };

      if (!req.body.id) {
        return fail("ID invalido");
      }

      if (!req.body.dataInicio) {
        return fail("Data de inicio invalida");
      }

      if (!req.body.dataFim) {
        return fail("Data de encerramento invalida");
      }

      if (!req.body.idAnuncio) {
        return fail("ID do anuncio invalido");
      }

      const anuncio = await this.anuncioService.read(req.body.idAnuncio);

      if (!anuncio) return fail("Erro ao consultar anuncio");

      const locador = anuncio.usuarioId;

      const aluguelDTO: CreateAluguelDTO = {
        ...req.body,
        idLocatario: req.userId,
        idLocador: locador,
      };

      const aluguel = await this.aluguelService.create(aluguelDTO);

      if (aluguel) {
        return res.status(201).json({ data: aluguel });
      }

      fail("erro ao adicionar aluguel", 500);
    });
  }

  public update(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      const fail = (msg: string, status = 400) => {
        res.status(status).json({ error: msg });
      };

      try {
        const id = req.query.id as string;

        const newData = req.body;
        newData.idLocador = undefined;
        newData.idLocatario = undefined;

        const aluguel = await this.aluguelService.read(id);

        if (!aluguel) {
          return fail("aluguel not found", 404);
        }

        if (aluguel.idLocatario !== req.userId) {
          return fail("User doesn't have permission to edit this aluguel", 403);
        }

        const updated = await this.aluguelService.update(id, newData);

        res.send({
          data: { ...updated },
        });
      } catch (err) {
        console.log(err);

        return res.status(500).json({ err });
      }
    });
  }

  public async read(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const id = req.query.id as string;

        const aluguel = await this.aluguelService.read(id);

        if (!aluguel) {
          res.status(404);
          res.send({
            error: "No aluguel found with this id",
          });
          return;
        }

        const aluguelUsers = [aluguel.idLocatario, aluguel.idLocador];
        if (!aluguelUsers.includes(req.userId)) {
          return res
            .status(403)
            .send("You don't have permission to get this aluguel");
        }

        res.send({
          data: aluguel,
        });
      } catch (err) {
        console.error("erro: ", err);

        return res.status(500).json({ err });
      }
    });
  }

  public delete(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const id = req.query.id as string;

        const aluguel = await this.aluguelService.read(id);

        if (!aluguel) {
          res.status(404);
          res.send({
            error: "No aluguel found with this id",
          });
          return;
        }

        const aluguelUsers = [aluguel.idLocatario, aluguel.idLocador];
        if (!aluguelUsers.includes(req.userId)) {
          return res
            .status(403)
            .send("You don't have permission to get this aluguel");
        }

        await this.aluguelService.delete(id);

        res.send("Aluguel deleted successfully");
      } catch (err) {
        console.error("erro: ", err);

        return res.status(500).json({ err });
      }
    });
  }
}

export default AluguelController;
