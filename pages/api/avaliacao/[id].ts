import { NextApiRequest, NextApiResponse } from "next";
import avaliacaoHandlers from "@/server/handlers/avaliacao-handler";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return avaliacaoHandlers.read(req, res);
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    return avaliacaoHandlers.update(req, res);
  }

  if (req.method === "DELETE") {
    return avaliacaoHandlers.delete(req, res);
  }

  return res.status(405).json({
    error: "Método não permitido.",
  });
}
