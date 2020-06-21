import { Pool, PoolClient } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  return client;
};

export const toTimestamp = (date_string?: string): string | null => {
  if (date_string === undefined) {
    return null;
  }
  const date: Date = new Date(date_string);
  return date.toISOString();
};
