import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { alugueis } from "@/infra/database/schemas/alugueisSchema";

export const insertAluguelSchema = createInsertSchema(alugueis)
  .omit({
    id: true,
    idLocador: true,
    idLocatario: true,
  })
  .extend({
    dataInicio: z.coerce.date(),
    dataFim: z.coerce.date(),
  });
export const selectAluguelSchema = createSelectSchema(alugueis);
