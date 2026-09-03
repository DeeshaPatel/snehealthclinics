import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({

    user: env.DB_USER,

    host: env.DB_HOST,

    database: env.DB_NAME,

    password: env.DB_PASSWORD,

    port: env.DB_PORT,

    ssl: {
        rejectUnauthorized: false
    }

});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL error:", err);
});


export default pool;