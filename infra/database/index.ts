import { drizzle } from "drizzle-orm/mysql2";
import mysql, { SslOptions } from "mysql2/promise";
import {
  anuncios,
  anunciosRelations,
  fotoAnuncios,
  fotoRelations,
} from "./schemas/anunciosSchema";
import { alugueis, alugueisRelations } from "./schemas/alugueisSchema";

import { usuariosRelations as usersRelations } from "./schemas/usuariosSchema";
import { usuarios } from "./schemas/usuariosSchema";
import { boolean } from "zod";
import {
  historicoPagamentos,
  historicoPagamentosRelations,
} from "./schemas/historicoPagamentoSchema";

const config: mysql.PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT ?? "3306"),
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
    alugueisRelations,
    usersRelations,
    historicoPagamentos,
    historicoPagamentosRelations,
  },
  mode: "default",
});

function getSslValues(): string | SslOptions | undefined {
  if (process.env.CA_CERTIFICATE) {
    return {
      ca: process.env.CA_CERTIFICATE,
      rejectUnauthorized: true,
    };
  }
  return process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false };
}
