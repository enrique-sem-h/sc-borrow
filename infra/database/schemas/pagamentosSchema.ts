import { mysqlTable, varchar, float, timestamp } from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";
import { alugueis } from "./alugueisSchema";

export const pagamentos = mysqlTable("pagamentos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  metodo: varchar("metodo", {
    length: 50,
    enum: ["Cartão de Crédito", "PIX"],
  }).notNull(),
  valor: float("valor").notNull(),
  status: varchar("status", {
    length: 20,
    enum: ["Pendente", "Concluído", "Reembolsado"],
  })
    .default("Pendente")
    .notNull(),
  dataPagamento: timestamp("data_pagamento").notNull(),

  idAluguel: varchar("id_aluguel", { length: 36 })
    .references(() => alugueis.id)
    .notNull(),
});

export const reembolsos = mysqlTable("reembolsos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  valor: float("valor").notNull(),
  data: timestamp("data").notNull(),
  motivo: varchar("motivo", { length: 255 }).notNull(),

  idPagamento: varchar("id_pagamento", { length: 36 })
    .references(() => pagamentos.id)
    .notNull(),
});
