import fs from "fs";
import path from "path";
import { QueryResult } from "pg";
import { getClient } from "./database";
import { DealTheme } from "../lib/types";

const insertOrUpdateDealThemeSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/insertOrUpdateDealTheme.sql"),
  { encoding: "utf-8" }
);

export const insertOrUpdate = async (
  dealId: string,
  theme: DealTheme
): Promise<void> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      insertOrUpdateDealThemeSQL,
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
