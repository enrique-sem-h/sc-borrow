import { NextApiResponse } from "next";
import UserService from "../services/user-service";
import { NextAuthApiRequest } from "../types";
import BaseController from "./base-controller";
import authMiddleware from "../middlewares/auth";

class UserController extends BaseController {
  private userService = new UserService();

  constructor() {
    super();
    this.use(authMiddleware);
  }

  public getCarteira(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const userId = req.userId;

        const result = await this.userService.getCarteira(userId);

        return res.status(200).send({
          data: result,
        });
      } catch (error) {
        console.error(error);

        return res.status(500).send({
          error: "Error",
        });
      }
    });
  }

  public getSaldo(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const userId = req.userId;

        const result = await this.userService.getSaldo(userId);

        return res.status(200).send({
          data: result,
        });
      } catch (error) {
        console.error(error);

        return res.status(500).send({
          error: "Error",
        });
      }
    });
  }

  public getRep(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const userId = req.userId;

        const result = await this.userService.getRep(userId);

        return res.status(200).send({
          data: result,
        });
      } catch (error) {
        console.error(error);

        return res.status(500).send({
          error: "Error",
        });
      }
    });
  }

  public resgatarSaldo(req: NextAuthApiRequest, res: NextApiResponse) {
    this.handleRequest(req, res, async () => {
      try {
        const userId = req.userId;

        await this.userService.resgatarSaldo(userId);

        return res.status(200).send({
          message: "Success",
        });
      } catch (error) {
        console.error(error);

        return res.status(500).send({
          error: "Error",
        });
      }
    });
  }
}

export default UserController;
