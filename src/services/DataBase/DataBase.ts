import { Pool } from "pg";
import { env } from "process";

const DataBase = new Pool({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: +env.DB_PORT,
});

DataBase.connect();

export { DataBase };
