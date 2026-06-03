import { NextApiResponse } from "next";
import {
  ControllerMiddleware,
  NextFunction,
} from "../controllers/base-controller";
import { z, ZodError } from "zod";
import { NextFormApiRequest } from "../types";

interface RequestValidationSchema {
  body?: z.ZodType;
  query?: z.ZodType;
  files?: z.ZodType;
}

export const validate = (
  schemas: RequestValidationSchema,
): ControllerMiddleware => {
  const middleware = async (
    req: NextFormApiRequest,
    res: NextApiResponse,
    next: NextFunction,
  ) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.query) {
        await schemas.query.parseAsync(req.query);
      }

      if (schemas.files) {
        if (!req.files) {
          throw new Error("Unable to parse files: unknown");
        }
        const files = Object.values(req.files).flat();

        await schemas.files.parseAsync(files);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      return res.status(400).json({ error });
    }
  };
  return middleware;
};
