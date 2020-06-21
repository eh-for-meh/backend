import fs from "fs";
import path from "path";
import { getClient, toTimestamp } from "./database";
import { Deal, DealLaunch } from "../lib/types";
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
      minimumLimit: data.minPurchaseCount,
    },
    soldOutAt: data.soldOutAt,
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
  const result = await client.query(getCurrentDealSQL);
  client.release();
  if (result.rowCount === 0) {
    throw new Error("No deal found!");
  }
  return dataToDeal(result.rows[0]);
};

export const getDeal = async (dealId: string): Promise<Deal> => {
  const client = await getClient();
  const result = await client.query(getDealSQL, [dealId]);
  client.release();
  if (result.rowCount === 0) {
    throw new Error("No deal found!");
  }
  return dataToDeal(result.rows[0]);
};

export const insertOrUpdate = async (deal: Deal): Promise<void> => {
  const client = await getClient();
  const launches: DealLaunch[] = deal.launches || [];
  const launchThatSoldOut = launches.find(
    (launch) =>
      launch.soldOutAt !== undefined &&
      launch.soldOutAt !== null &&
      launch.soldOutAt.length > 0
  );
  const { soldOutAt = undefined } = launchThatSoldOut || {};
  await client.query(insertOrUpdateCurrentDealSQL, [
    deal.id,
    toTimestamp(deal.created_at),
    deal.features.toString(),
    deal.url,
    deal.purchaseQuantity.maximumLimit || -1,
    deal.purchaseQuantity.minimumLimit || -1,
    deal.photos,
    toTimestamp(soldOutAt),
    deal.specifications,
    deal.title,
  ]);
  await client.release();
};
