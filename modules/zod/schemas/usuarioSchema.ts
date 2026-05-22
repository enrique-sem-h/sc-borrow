import { usuarios } from "@/infra/database/schemas/usuariosSchema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertUserSchema = createInsertSchema(usuarios);
export const userSchema = createSelectSchema(usuarios);
