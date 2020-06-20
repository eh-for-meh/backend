import { QueryResult } from "pg";
import { getClient } from "./database";
import { DealTheme } from "../lib/types";

export const getForDeal = async (dealId: string): Promise<DealTheme> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      `SELECT accent_color as accentColor, background_color as backgroundColor, background_photo_url as backgroundImage, foreground FROM deal_themes WHERE deal_id = $1;`,
      [dealId],
      (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(new Error("No deal theme found!"));
        } else {
          resolve(result.rows[0] as DealTheme);
        }
      }
    );
  });
};

export const insertOrUpdate = async (
  dealId: string,
  theme: DealTheme
): Promise<void> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      `INSERT INTO deal_themes(accent_color, background_color, background_photo_url, deal_id, foreground) VALUES($1, $2, $3, $4, $5)
      ON CONFLICT (deal_id)
      DO UPDATE SET accent_color = $1, background_color = $2, background_photo_url = $3, foreground = $5;`,
      [
        theme.accentColor,
        theme.backgroundColor,
        theme.backgroundImage,
        dealId,
        theme.foreground,
      ],
      (err: Error, _: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
};
