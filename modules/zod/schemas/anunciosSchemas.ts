import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertAnuncioSchema = createInsertSchema(anuncios).extend({
  titulo: z.string().trim().min(1),
  descricao: z.string().trim().min(1),
  caucao: z.number().nonnegative(),
  valorDiario: z.number().nonnegative(),
  usuarioId: z.string().optional(),
});
export const anuncioSchema = createSelectSchema(anuncios);

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

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
