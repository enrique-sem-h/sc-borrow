import anuncioHandlers from "@/server/handlers/anuncio-handlers";
import { NextAuthApiRequest } from "@/server/types";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return anuncioHandlers.create(req as NextAuthApiRequest, res);
  }
}
