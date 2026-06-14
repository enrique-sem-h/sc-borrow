import anuncioHandlers from "@/server/handlers/anuncio-handlers";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api:{
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT" || req.method === "PATCH") {
    return anuncioHandlers.update(req, res);
  } else if (req.method === "DELETE") {
    return anuncioHandlers.delete(req, res);
  } else if (req.method === "GET") {
    return anuncioHandlers.read(req, res);
  }
}
