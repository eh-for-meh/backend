import fs from "fs";
import path from "path";
import { QueryResult } from "pg";
import { getClient } from "./database";
import { DealStory } from "../lib/types";

const insertOrUpdateDealStorySQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/insertOrUpdateDealStory.sql"),
  { encoding: "utf-8" }
);

export const insertOrUpdate = async (
  dealId: string,
  story: DealStory
): Promise<void> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      insertOrUpdateDealStorySQL,
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
