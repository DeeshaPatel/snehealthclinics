import { Client } from "pg";

let currentEnv = null;

export function setDatabaseEnv(env) {
    currentEnv = env;
}

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

const pool = {

    // ========================================
    // NORMAL QUERY
    // ========================================

    async query(text, params = []) {

        const client = await getClient();

        try {

            return await client.query(
                text,
                params
            );

        } catch (error) {

            console.error(
                "PostgreSQL query error:",
                error
            );

            throw error;

        } finally {

            await client.end();

        }

    },


    // ========================================
    // TRANSACTION CONNECTION
    // ========================================

    async connect() {

        const client =
            await getClient();

        return {

            query: async (
                text,
                params = []
            ) => {

                return await client.query(
                    text,
                    params
                );

            },


            release: async () => {

                try {

                    await client.end();

                } catch (error) {

                    console.error(
                        "PostgreSQL connection close error:",
                        error
                    );

                }

            }

        };

    }

};

export default pool;