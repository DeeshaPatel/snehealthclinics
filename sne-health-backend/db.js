import { Client } from "pg";

/**
 * Execute a PostgreSQL query through Cloudflare Hyperdrive.
 *
 * @param {object} env - Cloudflare Worker environment
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<object>} PostgreSQL query result
 */
export async function query(env, text, params = []) {

    const client = new Client({
        connectionString: env.HYPERDRIVE.connectionString
    });

    try {

        await client.connect();

        const result = await client.query(text, params);

        return result;

    } catch (error) {

        console.error("PostgreSQL error:", error);

        throw error;

    } finally {

        await client.end();

    }
}
