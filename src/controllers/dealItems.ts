import fs from "fs";
import path from "path";
import { QueryResult } from "pg";
import { getClient } from "./database";
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
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      getDealItemsSQL,
      [dealId],
      async (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        }
        const items = result.rows.map((row: any) => {
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
        resolve(items);
      }
    );
  });
};

export const insertOrUpdate = async (
  dealId: string,
  item: DealItem
): Promise<void> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      insertOrUpdateDealItemSQL,
      [
        item.attributes.map((attribute) => JSON.stringify(attribute)),
        item.condition,
        item.id,
        dealId,
        item.photo,
        item.price,
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
