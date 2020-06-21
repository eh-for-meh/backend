import fs from "fs";
import path from "path";
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
  await client.query(insertOrUpdateDealStorySQL, [
    dealId,
    story.body,
    story.title,
  ]);
  client.release();
};
