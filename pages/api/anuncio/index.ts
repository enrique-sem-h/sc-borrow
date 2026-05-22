import anuncioHandlers from "@/server/handlers/anuncio-handlers";
import { NextApiRequest, NextApiResponse } from "next";
import AuthMiddleware from "../../../server/services/middlewares/auth-middleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return AuthMiddleware.verifyToken(req, res, () => {
      return anuncioHandlers.create(req, res);
    });
  }
}
