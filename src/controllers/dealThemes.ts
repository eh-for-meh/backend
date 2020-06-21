import fs from "fs";
import path from "path";
import { query } from "./database";
import { DealTheme } from "../lib/types";

const insertOrUpdateDealThemeSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/insertOrUpdateDealTheme.sql"),
  { encoding: "utf-8" }
);

export const insertOrUpdate = async (
  dealId: string,
  theme: DealTheme
): Promise<void> => {
  await query(insertOrUpdateDealThemeSQL, [
    theme.accentColor,
    theme.backgroundColor,
    theme.backgroundImage,
    dealId,
    theme.foreground,
  ]);
};
