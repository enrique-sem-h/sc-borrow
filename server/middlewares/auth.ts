import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import {
  ControllerMiddleware,
  NextFunction,
} from "../controllers/base-controller";
import { Usuario } from "@/infra/database/schemas/usuariosSchema";

interface NextAuthMiddlewareApiRequest extends NextApiRequest {
  userId?: string;
}

export interface NextAuthApiRequest extends NextApiRequest {
  userId: string;
}

const authMiddleware: ControllerMiddleware = (
  req: NextAuthMiddlewareApiRequest,
  res: NextApiResponse,
  next: NextFunction,
) => {
  try {
    const headers = req.headers;
    const authorizationHeader = headers["authorization"];

    if (!authorizationHeader) {
      res.status(401);
      return res.send("Missing authorization header");
    }

    const [prefix, token] = authorizationHeader!.split(" ") || [];

    if (prefix !== "Bearer") {
      res.status(401);
      return res.send("Authorization prefix has to be Bearer");
    }

    try {
      const user = jwt.verify(token, process.env.SECRET!) as Usuario;

      req.userId = user.id;

      next!();
    } catch (err) {
      res.status(401);
      return res.send("Token invalid or expired");
    }
  } catch (err) {
    console.log(err);

    res.status(401);
    res.send("Missing authorization header");
  }
};

export default authMiddleware;
