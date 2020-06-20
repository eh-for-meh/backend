import { QueryResult } from "pg";
import { getClient, toTimestamp } from "./database";
import * as DealThemeController from "./dealThemes";
import { Deal } from "../lib/types";

export const getCurrent = async (): Promise<Deal> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      `SELECT * FROM deals WHERE created_at IS NOT NULL ORDER BY created_at DESC LIMIT 1;`,
      async (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(new Error("No deal found!"));
        } else {
          const deal: Deal = result.rows[0];
          try {
            const values = await Promise.all([
              DealThemeController.getForDeal(deal.id),
            ]);
            deal.theme = values[0];
            resolve(deal);
          } catch (err) {
            reject(err);
          }
        }
      }
    );
  });
};

export const insertOrUpdate = async (deal: Deal): Promise<unknown[]> => {
  const client = await getClient();
  return Promise.all([
    new Promise((resolve, reject) => {
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
          client.release(true);
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    }),
    DealThemeController.insertOrUpdate(deal.id, deal.theme),
  ]);
};
