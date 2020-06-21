import fs from "fs";
import path from "path";
import { Details } from "express-useragent";
import { query } from "./database";

const insertRouteLogSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/insertRouteLog.sql"),
  { encoding: "utf-8" }
);

export const insertRouteLog = async (
  path: string,
  method: string,
  useragent: Details
) => {
  const { browser, version, os, platform, source } = useragent;
  await query(insertRouteLogSQL, [
    path,
    method,
    browser,
    version,
    os,
    platform,
    source,
  ]);
};
