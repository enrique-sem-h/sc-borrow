import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./infra/database/schemas/*",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD || "",
    user: process.env.DB_USER,
  },
});
