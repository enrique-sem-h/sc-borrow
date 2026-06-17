import { NextAuthApiRequest } from "@/server/types";
import { NextApiRequest, NextApiResponse } from "next";
import checkoutHandlers from "@/server/handlers/checkout-handlers";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("HANDLING");

  if (req.method === "POST") {
    console.log("POSTING");
    return checkoutHandlers.stripeResponse(req as NextAuthApiRequest, res);
  }
  return res.status(405).json({ error: "Metodo nao permitido" });
}
