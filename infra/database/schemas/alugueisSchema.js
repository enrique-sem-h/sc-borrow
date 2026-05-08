import {
  mysqlTable,
  int,
  varchar,
  float,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";
import { usuarios } from "./usuariosSchema";
import { anuncios } from "./anunciosSchema";

export const alugueis = mysqlTable("alugueis", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  dataInicio: timestamp("data_inicio").notNull(),
  dataFim: timestamp("data_fim").notNull(),

  idAnuncio: varchar("id_anuncio", { length: 36 })
    .references(() => anuncios.id)
    .notNull(),
  idUsuario: varchar("id_usuario", { length: 36 })
    .references(() => usuarios.id)
    .notNull(),
});
