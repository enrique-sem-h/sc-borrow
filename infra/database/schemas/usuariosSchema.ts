import { mysqlTable, int, varchar, float } from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const usuarios = mysqlTable("usuarios", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  cpf: varchar("cpf", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 12 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  senha: varchar("senha", { length: 255 }).notNull(),
  cep: varchar("cep", { length: 255 }).notNull(),
  logradouro: varchar("logradouro", { length: 255 }).notNull(),
  bairro: varchar("bairro", { length: 255 }).notNull(),
  numero: int("numero").notNull(),
  uf: varchar("uf", { length: 2, enum: ["DF"] }).notNull(),
  complemento: varchar("complemento", { length: 50 }),
  rep: float("rep", { precision: 4, scale: 2 }).notNull(),
  saldo: float("saldo").notNull().default(0),
});

export type Usuario = InferSelectModel<typeof usuarios>;
export type UsuarioInsert = InferInsertModel<typeof usuarios>;
