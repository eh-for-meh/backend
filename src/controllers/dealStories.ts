import { QueryResult } from "pg";
import { getClient } from "./database";
import { DealStory } from "../lib/types";

export const insertOrUpdate = async (
  dealId: string,
  story: DealStory
): Promise<void> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      `INSERT INTO deal_stories(deal_id, body, title) VALUES($1, $2, $3)
      ON CONFLICT (deal_id)
      DO UPDATE SET body = $2, title = $3;`,
      [dealId, story.body, story.title],
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
