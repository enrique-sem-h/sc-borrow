import { NextApiRequest, NextApiResponse } from "next";
import AuthMiddleware from "../../../server/services/middlewares/auth-middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return AuthMiddleware.verifyToken(req, res, () => {
    return res.status(200).json({
      message: "Acesso autorizado.",
      user: req.user,
    });
  });
}
