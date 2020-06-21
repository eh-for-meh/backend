import fs from "fs";
import path from "path";
import { query } from "./database";
import { DealItem } from "../lib/types";

const getDealItemsSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/getDealItems.sql"),
  { encoding: "utf-8" }
);
const insertOrUpdateDealItemSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/insertOrUpdateDealItem.sql"),
  { encoding: "utf-8" }
);

export const getForDeal = async (dealId: string): Promise<DealItem[]> => {
  const result = await query(getDealItemsSQL, [dealId]);
  return result.rows.map((row: any) => {
    return {
      attributes: row.attributes.map((attribute: string) =>
        JSON.parse(attribute)
      ),
      condition: row.condition,
      id: row.id,
      photo: row.photo_url,
      price: row.price,
    };
  });
};

export const insertOrUpdate = async (
  dealId: string,
  item: DealItem
): Promise<void> => {
  await query(insertOrUpdateDealItemSQL, [
    item.attributes.map((attribute) => JSON.stringify(attribute)),
    item.condition,
    item.id,
    dealId,
    item.photo,
    item.price,
  ]);
};
