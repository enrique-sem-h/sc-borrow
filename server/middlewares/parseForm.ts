import { NextApiResponse } from "next";
import {
  ControllerMiddleware,
  NextFunction,
} from "../controllers/base-controller";
import formidable from "formidable";
import { NextFormApiRequest } from "../types";

// campos que nao devem ser parseados como numero
const WHITELISTEDFIELDS = ["cpf", "telefone", "senha"];

export const parseForm: ControllerMiddleware = async (
  req: NextFormApiRequest,
  res: NextApiResponse,
  next: NextFunction,
) => {
  const incomingForm = formidable({
    multiples: true,
    keepExtensions: true,
  });

  try {
    const [fields, files] = await incomingForm.parse(req);
    const parsedFields: Record<string, any> = {};

    const getField = (key: string) =>
      Array.isArray(fields[key]) ? fields[key]?.[0] : fields[key];

    for (const field of Object.keys(fields)) {
      const value = getField(field);
      parsedFields[field] =
        value?.trim() === "" ||
        !/^-?\d+(\.\d+)?$/.test(value || "undefined") ||
        WHITELISTEDFIELDS.includes(field)
          ? value
          : Number(value);
    }

    req.body = {
      ...req.body,
      ...parsedFields,
    };

    req.files = files;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro interno: formidable parse failed" });
  }
};
