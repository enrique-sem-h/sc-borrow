import {
  mysqlTable,
  int,
  varchar,
  float,
  boolean,
} from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";
import { usuarios } from "./usuariosSchema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const anuncios = mysqlTable("anuncios", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  categoria: varchar("categoria", {
    length: 255,
    enum: [
      "Ferramentas",
      "Camping",
      "Equipamentos de festa",
      "Lazer",
    ],
  }).notNull(),
  valorDiario: float("valor_diario").notNull(),
  caucao: float("caucao").notNull(),

  usuarioId: varchar("usuario_id", { length: 36 })
    .references(() => usuarios.id)
    .notNull(),
});

export type Anuncio = InferSelectModel<typeof anuncios>;
export type AnuncioInsert = InferInsertModel<typeof anuncios>;

export const fotoAnuncios = mysqlTable("foto_anuncio", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  url: varchar("url", { length: 255 }).notNull(),
  ordem: int("ordem").notNull(),
  principal: boolean("principal").notNull().default(false),

  anuncioId: varchar("anuncio_id", { length: 36 })
    .references(() => anuncios.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
});

export const anunciosRelations = relations(anuncios, ({ many }) => ({
  fotos: many(fotoAnuncios),
}));

export const fotoRelations = relations(fotoAnuncios, ({ one }) => ({
  anuncio: one(anuncios, {
    fields: [fotoAnuncios.anuncioId],
    references: [anuncios.id],
  }),
}));
