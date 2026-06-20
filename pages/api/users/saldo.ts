import userHandlers from "@/server/handlers/user-handlers";
import { NextAuthApiRequest } from "@/server/types";
import { NextApiResponse } from "next";

export default async function handler(
  req: NextAuthApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    return userHandlers.getSaldo(req, res);
  }

  return res.status(405).json({
    error: "Método não permitido.",
  });
}
