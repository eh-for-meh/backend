import fs from "fs";
import path from "path";
import { Details } from "express-useragent";
import { QueryResult } from "pg";
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
  const client = await getClient();
  const { browser, version, os, platform, source } = useragent;
  return new Promise((resolve, reject) => {
    client.query(
      insertRouteLogSQL,
      [path, method, browser, version, os, platform, source],
      async (err: Error, _: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
};
