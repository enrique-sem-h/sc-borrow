import aluguelHandlers from "@/server/handlers/aluguel-handlers";
import checkoutHandlers from "@/server/handlers/checkout-handlers";
import { NextAuthApiRequest } from "@/server/types";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return aluguelHandlers.dispatch(req as NextAuthApiRequest, res);
  }
  return res.status(405).json({ error: "Metodo nao permitido" });
}
