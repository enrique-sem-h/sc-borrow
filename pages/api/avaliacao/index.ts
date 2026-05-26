import { NextApiRequest, NextApiResponse } from "next";
import avaliacaoHandlers from "@/server/handlers/avaliacao-handler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return avaliacaoHandlers.create(req, res);
  }

  if (req.method === "GET") {
    return avaliacaoHandlers.list(req, res);
  }

  return res.status(405).json({
    error: "Método não permitido",
  });
}
