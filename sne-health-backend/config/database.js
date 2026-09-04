import { Client } from "pg";

/*
=========================================================
CLOUDFLARE HYPERDRIVE DATABASE
=========================================================
*/

let currentEnv = null;


/*
=========================================================
SET CLOUDFLARE ENVIRONMENT
=========================================================
*/

export function setDatabaseEnv(env) {
    currentEnv = env;
}


/*
=========================================================
GET DATABASE CLIENT
=========================================================
*/

async function getClient() {

    if (!currentEnv) {
        throw new Error(
            "Database environment has not been initialized."
        );
    }

    if (!currentEnv.HYPERDRIVE) {
        throw new Error(
            "HYPERDRIVE binding is not available."
        );
    }

    const client = new Client({
        connectionString:
            currentEnv.HYPERDRIVE.connectionString
    });

    await client.connect();

    return client;
}


/*
=========================================================
POOL-COMPATIBLE QUERY
=========================================================
*/

const pool = {

    async query(text, params = []) {

        const client = await getClient();

        try {

            const result = await client.query(
                text,
                params
            );

            return result;

        } catch (error) {

            console.error(
                "PostgreSQL query error:",
                error
            );

            throw error;

        } finally {

            await client.end();

        }
    }

};


export default pool;

