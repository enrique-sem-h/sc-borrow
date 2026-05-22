import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertAnuncioSchema = createInsertSchema(anuncios);
export const anuncioSchema = createSelectSchema(anuncios);
