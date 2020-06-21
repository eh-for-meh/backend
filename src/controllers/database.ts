import { Pool, PoolClient, QueryResult } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = async (
  queryString: string,
  queryValues?: any[]
): Promise<QueryResult> => {
  const client = await pool.connect();
  try {
    return await client.query(queryString, queryValues);
  } catch (err) {
    throw err;
  } finally {
    await client.release();
  }
};

export const toTimestamp = (date_string?: string): string | null => {
  if (date_string === undefined) {
    return null;
  }
  const date: Date = new Date(date_string);
  return date.toISOString();
};
