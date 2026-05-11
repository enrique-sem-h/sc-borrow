import anuncioHandlers from "@/server/handlers/anuncio-handlers";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
     return anuncioHandlers.create(req, res)
  } else if (req.method === "GET") {
     return anuncioHandlers.read(req, res)
  }
}
