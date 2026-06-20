import { mysqlTable, varchar, timestamp, float } from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";
import { usuarios } from "./usuariosSchema";
import { anuncios } from "./anunciosSchema";
import { InferSelectModel, relations } from "drizzle-orm";
import { historicoPagamentos } from "./historicoPagamentoSchema";

export enum AluguelStatus {
  WAITING_FOR_PAYMANT,
  CANCELLED,
  WAITING_FOR_DISPATCH,
  WAITING_FOR_DELIVERY,
  ITEM_IN_HAND,
  COMPLETED,
}
export const aluguelStatusArr = [
  "WAITING_FOR_PAYMANT",
  "WAITING_FOR_CONFIRM",
  "WAITING_FOR_DISPATCH",
  "WAITING_FOR_DELIVERY",
  "ITEM_IN_HAND",
  "WAITING_FOR_RETURN_CONFIRM",
  "COMPLETED",
  "CANCELLED",
] as const;

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
  valorTotal: float("valor_total").notNull(),
  status: varchar("status", {
    length: 50,
    enum: aluguelStatusArr,
  })
    .default("WAITING_FOR_CONFIRM")
    .notNull(),
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
  pagamentos: r.many(historicoPagamentos),
}));
