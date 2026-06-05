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

  idAnuncio: varchar("id_anuncio", { length: 36 }).references(
    () => anuncios.id,
    { onDelete: "set null" },
  ),
  idLocador: varchar("id_locador", { length: 36 })
    .references(() => usuarios.id, { onDelete: "restrict" })
    .notNull(),
  idLocatario: varchar("id_locatario", { length: 36 })
    .references(() => usuarios.id, { onDelete: "restrict" })
    .notNull(),
});
