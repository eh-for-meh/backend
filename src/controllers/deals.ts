import fs from "fs";
import path from "path";
import { QueryResult } from "pg";
import { getClient, toTimestamp } from "./database";
import { Deal } from "../lib/types";
import * as DealItemsController from "./dealItems";
import * as TopicsController from "../controllers/topics";

const getCurrentDealSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/getCurrentDeal.sql"),
  { encoding: "utf-8" }
);
const getDealSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/getDeal.sql"),
  { encoding: "utf-8" }
);
const insertOrUpdateCurrentDealSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/insertOrUpdateCurrentDeal.sql"),
  { encoding: "utf-8" }
);

const dataToDeal = async (data: any): Promise<Deal> => {
  const values = await Promise.all([
    DealItemsController.getForDeal(data.id),
    TopicsController.getForDeal(data.id),
  ]);
  return {
    created_at: data.created_at,
    features: data.features,
    id: data.id,
    items: values[0],
    photos: data.photos,
    purchaseQuantity: {
      maximumLimit: data.maxPurchaseCount,
      minimumLimit: data.minPurchaseCount
    },
    soldOutAt: data.sold_out_at,
    specifications: data.specifications,
    theme: {
      accentColor: data.accentColor,
      backgroundColor: data.backgroundColor,
      backgroundImage: data.backgroundImage,
      foreground: data.foreground,
    },
    title: data.title,
    topic: values[1],
    story: {
      body: data.storyBody,
      title: data.storyTitle,
    },
    url: data.url,
  };
};

export const getCurrent = async (): Promise<Deal> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(getCurrentDealSQL, async (err: Error, result: QueryResult) => {
      client.release(true);
      if (err) {
        reject(err);
      } else if (result.rowCount === 0) {
        reject(new Error("No deal found!"));
      }
      dataToDeal(result.rows[0]).then(resolve).catch(reject);
    });
  });
};

export const getDeal = async (dealId: string): Promise<Deal> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      getDealSQL,
      [dealId],
      async (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(new Error("No deal found!"));
        }
        dataToDeal(result.rows[0]).then(resolve).catch(reject);
      }
    );
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
        deal.purchaseQuantity.maximumLimit || -1,
        deal.purchaseQuantity.minimumLimit || -1,
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
