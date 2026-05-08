import {
  mysqlTable,
  int,
  varchar,
  float,
  boolean,
  timestamp,
  text,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { randomUUID } from "node:crypto";
import { usuarios } from "./usuariosSchema";
import { anuncios } from "./anunciosSchema";

export const chats = mysqlTable("chats", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  criadoEm: timestamp("criado_em").defaultNow().notNull(),

  idAnuncio: varchar("id_anuncio", { length: 36 })
    .references(() => anuncios.id)
    .notNull(),
});

export const chatParticipantes = mysqlTable(
  "chat_participantes",
  {
    idChat: varchar("id_chat", { length: 36 }).references(() => chats.id),
    idUsuario: varchar("id_usuario", { length: 36 }).references(
      () => usuarios.id,
    ),
  },
  (chatParticipantes) => [
    primaryKey({
      columns: [chatParticipantes.idChat, chatParticipantes.idUsuario],
    }),
  ],
);

export const mensagens = mysqlTable("mensagens", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  mensagem: text("mensagem").notNull(),
  enviadoEm: timestamp("enviado_em").defaultNow().notNull(),

  idChat: varchar("id_chat", { length: 36 })
    .references(() => chats.id)
    .notNull(),
  remetenteId: varchar("remetente_id", { length: 36 })
    .references(() => usuarios.id)
    .notNull(),
});
