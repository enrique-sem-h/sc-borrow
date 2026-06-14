import aluguelHandlers from "@/server/handlers/aluguel-handlers";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthApiRequest } from "@/server/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return aluguelHandlers.create(req as NextAuthApiRequest, res);
  }
  if (req.method === "GET") {
    return aluguelHandlers.getAll(req as NextAuthApiRequest, res);
  }
}
