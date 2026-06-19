import notificacoesHandlers from "@/server/handlers/notificacoes-handler";
import { NextAuthApiRequest } from "@/server/types";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    return notificacoesHandlers.markAsRead(req as NextAuthApiRequest, res);
  }
  return res.status(405).send("Metodo nao permitido!");
}
