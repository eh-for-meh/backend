import fs from "fs";
import path from "path";
import { QueryResult } from "pg";
import { getClient, toTimestamp } from "./database";
import { Deal } from "../lib/types";
import * as DealItemsController from "./dealItems";

const getCurrentDealSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/getCurrentDeal.sql"),
  { encoding: "utf-8" }
);
const insertOrUpdateCurrentDealSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/insertOrUpdateCurrentDeal.sql"),
  { encoding: "utf-8" }
);

export const getCurrent = async (): Promise<Deal> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(getCurrentDealSQL, async (err: Error, result: QueryResult) => {
      client.release(true);
      if (err) {
        reject(err);
      } else if (result.rowCount === 0) {
        reject(new Error("No deal found!"));
      } else {
        const data = result.rows[0];
        const deal: Deal = {
          created_at: data.created_at,
          features: data.features,
          id: data.id,
          items: await DealItemsController.getForDeal(data.id),
          photos: data.photos,
          soldOutAt: data.soldOutAt,
          specifications: data.specifications,
          theme: {
            accentColor: data.accentColor,
            backgroundColor: data.backgroundColor,
            backgroundImage: data.backgroundImage,
            foreground: data.foreground,
          },
          title: data.title,
          topic: {
            id: "",
            createdAt: "",
            commentCount: 0,
            replyCount: 0,
            voteCount: 0,
            url: "",
          },
          story: {
            body: data.storyBody,
            title: data.storyTitle,
          },
          url: data.url,
        };
        resolve(deal);
      }
    });
  });
};

export const insertOrUpdate = async (deal: Deal): Promise<unknown[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      insertOrUpdateCurrentDealSQL,
      [
        deal.id,
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
  });
};
