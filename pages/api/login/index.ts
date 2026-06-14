import authHandlers from "../../../server/handlers/auth-handlers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    return authHandlers.login(req, res);
  }

  return res.status(405).json({
    error: "Método não permitido",
  });
}
