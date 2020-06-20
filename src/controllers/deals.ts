import { QueryResult } from "pg";
import { getClient, toTimestamp } from "./database";
import { Deal } from "../lib/types";

export const getCurrent = async (): Promise<Deal> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      `SELECT * FROM deals WHERE created_at IS NOT NULL ORDER BY created_at DESC LIMIT 1;`,
      (err: Error, result: QueryResult) => {
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(new Error("No deal found!"));
        } else {
          resolve(result.rows[0] as Deal);
        }
      }
    );
  });
};

export const insertOrUpdate = async (deal: Deal): Promise<void> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      `INSERT INTO deals(id, created_at, features, form_url, photo_urls, sold_out_at, specifications, title) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id)
      DO UPDATE SET features = $3, form_url = $4, photo_urls = $5, sold_out_at = $6, specifications = $7, title = $8;`,
      [
        deal.id,
        // TODO: Determine method of obtaining when a deal starts
        toTimestamp(deal.created_at),
        deal.features.toString(),
        deal.url,
        deal.photos,
        toTimestamp(deal.soldOutAt),
        deal.specifications,
        deal.title,
      ],
      (err: Error, _: QueryResult) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
};
