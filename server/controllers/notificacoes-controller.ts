import BaseController from "./base-controller";
import NotificacoesService from "../services/notificacoes-service";
import auth from "../middlewares/auth";
import { NextApiResponse } from "next";
import { NextAuthApiRequest } from "../types";

class NotificacoesController extends BaseController {
  private notificacoesService = new NotificacoesService();

  constructor() {
    super();
    this.use(auth);
  }

  public getAll(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      const userId = req.userId;

      const result = await this.notificacoesService.getAll(userId);

      return res.status(200).json({ data: result });
    });
  }

  public markAsRead(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      const notificationId = req.query.id;

      if (!notificationId || Array.isArray(notificationId)) {
        return res.status(400).json({ error: "Notificacao invalida" });
      }

      const result = await this.notificacoesService.markAsRead(
        notificationId,
        req.userId,
      );

      if (!result) {
        return res.status(404).json({ error: "Notificacao nao encontrada" });
      }

      return res.status(200).json({ data: result });
    });
  }
}

export default NotificacoesController;
