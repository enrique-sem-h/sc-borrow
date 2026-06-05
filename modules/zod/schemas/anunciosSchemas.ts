import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const insertAnuncioSchema = createInsertSchema(anuncios, {
  titulo: (schema) => schema.trim().min(1),
  descricao: (schema) => schema.trim().min(1),
  valorDiario: z.coerce.number().positive().min(1),
  caucao: z.coerce.number().positive().min(1),
}).omit({
  id: true,
  usuarioId: true,
});
export const anuncioSchema = createSelectSchema(anuncios);

const formidableFile = z.object({
  size: z.number().max(MAX_FILE_SIZE, {
    error: `files must be ${MAX_FILE_SIZE / 1024 / 1024}MB or less`,
  }),
  mimetype: z.enum(ACCEPTED_IMAGE_TYPES, {
    error: "image should be .png or .jpg/.jpeg",
  }),
});

export const FileValidationSchema = z
  .array(formidableFile)
  .min(3, { error: "User must upload at least 3 pictures" })
  .max(7, { error: "User can upload a maximum of 7 images" });
