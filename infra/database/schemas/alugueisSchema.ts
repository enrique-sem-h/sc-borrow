import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";
import { usuarios } from "./usuariosSchema";
import { anuncios } from "./anunciosSchema";
import { relations } from "drizzle-orm";

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
  status: varchar("status", {
    length: 50,
    enum: [
      "WAITING_FOR_PAYMANT",
      "CANCELLED",
      "WAITING_FOR_DISPATCH",
      "WAITING_FOR_DELIVERY",
      "ITEM_IN_HAND",
      "COMPLETED",
    ],
  }),
});

export const usuarioRelations = relations(usuarios, (r) => ({
  alugueisComoLocatario: r.many(alugueis, {
    relationName: "alugueis_locatario",
  }),
  alugueisComoLocador: r.many(alugueis, { relationName: "alugueis_locador" }),
}));

export const alugueisRelations = relations(alugueis, (r) => ({
  locador: r.one(usuarios, {
    fields: [alugueis.idLocador],
    references: [usuarios.id],
    relationName: "alugueis_locador",
  }),
  locatario: r.one(usuarios, {
    fields: [alugueis.idLocatario],
    references: [usuarios.id],
    relationName: "alugueis_locatario",
  }),
  anuncio: r.one(anuncios, {
    fields: [alugueis.idAnuncio],
    references: [anuncios.id],
  }),
}));
