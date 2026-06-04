import { anuncios } from "@/infra/database/schemas/anunciosSchema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertAnuncioSchema = createInsertSchema(anuncios, {
  titulo: (schema) => schema.min(1),
  descricao: (schema) => schema.min(1),
  valorDiario: z.coerce.number().positive().min(1),
  caucao: z.coerce.number().positive().min(1),
})
  .extend({
    fotos: z.array(z.instanceof(File)).min(3),
  })
  .omit({
    id: true,
    usuarioId: true,
  });
export const anuncioSchema = createSelectSchema(anuncios);
