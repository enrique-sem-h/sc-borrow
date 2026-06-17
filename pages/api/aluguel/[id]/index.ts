import aluguelHandlers from "@/server/handlers/aluguel-handlers";
import { NextAuthApiRequest } from "@/server/types";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT" || req.method === "PATCH") {
    return aluguelHandlers.update(req as NextAuthApiRequest, res);
  } else if (req.method === "DELETE") {
    return aluguelHandlers.delete(req as NextAuthApiRequest, res);
  } else if (req.method === "GET") {
    return aluguelHandlers.read(req as NextAuthApiRequest, res);
  }
}
