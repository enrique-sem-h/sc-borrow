import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};


const poolConnection = mysql.createPool(config);
export const db = drizzle(poolConnection);
