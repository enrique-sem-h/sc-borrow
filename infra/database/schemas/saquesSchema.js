import {
  mysqlTable,
  int,
  varchar,
  float,
  timestamp,
} from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";
import { usuarios } from "./usuariosSchema";

export const saques = mysqlTable("saques", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  valor: float("valor").notNull(),
  data: timestamp("data").defaultNow().notNull(),

  usuarioId: varchar("usuario_id", { length: 36 })
    .references(() => usuarios.id)
    .notNull(),
});
