import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  anuncios,
  anunciosRelations,
  fotoAnuncios,
  fotoRelations,
} from "./schemas/anunciosSchema";
import {
  alugueis,
  alugueisRelations,
  usuarioRelations,
} from "./schemas/alugueisSchema";
import { usuarios } from "./schemas/usuariosSchema";

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const poolConnection = mysql.createPool(config);
export const db = drizzle(poolConnection, {
  schema: {
    usuarios,
    anuncios,
    anunciosRelations,
    fotoAnuncios,
    fotoRelations,
    alugueis,
    usuarioRelations,
    alugueisRelations,
  },
  mode: "default",
});
