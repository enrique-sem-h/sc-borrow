import { NextAuthApiRequest } from "@/server/types";
import { NextApiRequest, NextApiResponse } from "next";
import checkoutHandlers from "@/server/handlers/checkout-handlers";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return checkoutHandlers.createIntent(req as NextAuthApiRequest, res);
  }
  return res.status(405).json({ error: "Metodo nao permitido" });
}
