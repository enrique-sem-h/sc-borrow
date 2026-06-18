import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import "dotenv/config";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test", override: true });
} else {
  // Carrega .env.local se existir, senão puxa do .env padrão
  config({ path: ".env.local", override: true });
  config({ path: ".env", override: true });
}

export default defineConfig({
  schema: "./infra/database/schemas/*",
  out: "./infra/database/migrations",
  dialect: "mysql",
  dbCredentials: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD || undefined,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT ?? "3306"),
    ssl: getSslValues(),
  },
});

function getSslValues() {
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
