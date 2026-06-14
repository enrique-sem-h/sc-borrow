import { usuarios } from "@/infra/database/schemas/usuariosSchema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertUserSchema = createInsertSchema(usuarios).extend({
  email: z.string().email(),
});
export const userSchema = createSelectSchema(usuarios).extend({
  email: z.string().email(),
});
