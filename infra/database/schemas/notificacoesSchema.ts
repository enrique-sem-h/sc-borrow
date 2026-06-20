import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";
import { usuarios } from "./usuariosSchema";
import { sql } from "drizzle-orm";

export const notificacoes = mysqlTable("notificacoes", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`(uuid())`),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: varchar("message", { length: 255 }).notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp().defaultNow().notNull(),

  usuarioId: varchar("usuario_id", { length: 36 })
    .references(() => usuarios.id)
    .notNull(),
});
