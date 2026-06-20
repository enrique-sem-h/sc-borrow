import { randomUUID } from "crypto";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { mysqlTable, varchar, float } from "drizzle-orm/mysql-core";
import { alugueis } from "./alugueisSchema";
import { usuarios } from "./usuariosSchema";

export const historicoPagamentos = mysqlTable("historico_pagamentos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  usuarioId: varchar("usuario_id", { length: 36 })
    .notNull()
    .references(() => usuarios.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  aluguelId: varchar("aluguel_id", { length: 36 })
    .notNull()
    .references(() => alugueis.id, {
      onDelete: "no action",
      onUpdate: "cascade",
    }),
  message: varchar("message", { length: 255 }).notNull(),
  saldo: float("saldo").notNull(),
});

export const historicoPagamentosRelations = relations(
  historicoPagamentos,
  ({ one }) => {
    return {
      usuario: one(usuarios, {
        fields: [historicoPagamentos.id],
        references: [usuarios.id],
      }),
      aluguel: one(alugueis, {
        fields: [historicoPagamentos.aluguelId],
        references: [alugueis.id],
      }),
    };
  },
);

export type HistoricoPagamentoInsert = InferInsertModel<
  typeof historicoPagamentos
>;
export type HistoricoPagamento = InferSelectModel<typeof historicoPagamentos>;
