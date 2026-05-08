import {
  mysqlTable,
  int,
  varchar,
  float,
  boolean,
} from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";
import { usuarios } from "./usuariosSchema";
import { alugueis } from "./alugueisSchema";

export const avaliacoes = mysqlTable("avaliacoes", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  nota: float("nota", { precision: 3, scale: 2 }).notNull(),
  mensagem: varchar("mensagem", { length: 255 }).notNull(),

  idUsuario: varchar("id_usuario", { length: 36 })
    .references(() => usuarios.id)
    .notNull(),
  idAluguel: varchar("id_aluguel", { length: 36 })
    .references(() => alugueis.id)
    .notNull(),
});
