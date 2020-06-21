import fs from "fs";
import path from "path";
import { Details } from "express-useragent";
import { getClient } from "./database";

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
  const client = await getClient();
  await client.query(insertRouteLogSQL, [
    path,
    method,
    browser,
    version,
    os,
    platform,
    source,
  ]);
  client.release();
};
