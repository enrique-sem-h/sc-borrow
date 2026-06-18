import { drizzle } from "drizzle-orm/mysql2";
import mysql, { SslOptions } from "mysql2/promise";
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
import { boolean } from "zod";

const config: mysql.PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: getSslValues(),
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

function getSslValues(): string | SslOptions | undefined {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
      rejectUnauthorized: true,
    };
  }
  return process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false };
}
