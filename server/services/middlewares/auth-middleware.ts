import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

class AuthMiddleware {
  public static verifyToken(
    req: NextApiRequest,
    res: NextApiResponse,
    next: Function,
  ) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token não fornecido",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Token inválido",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        error: "Token inválido ou expirado",
      });
    }
  }
}

export default AuthMiddleware;
