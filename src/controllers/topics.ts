import fs from "fs";
import path from "path";
import { QueryResult } from "pg";
import { getClient } from "./database";
import { Topic } from "../lib/types";

const getTopicForDealSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/getTopicForDeal.sql"),
  { encoding: "utf-8" }
);
const insertOrUpdateTopicSQL: string = fs.readFileSync(
  path.join(__dirname, "../../sql/insertOrUpdateTopic.sql"),
  { encoding: "utf-8" }
);

export const getForDeal = async (dealId: string): Promise<Topic> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      getTopicForDealSQL,
      [dealId],
      async (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(new Error("No deal topic found!"));
        }
        const data = result.rows[0];
        const topic: Topic = {
          commentCount: data.comment_count,
          createdAt: data.created_at,
          id: data.id,
          replyCount: data.reply_count,
          url: data.url,
          voteCount: data.vote_count,
        };
        resolve(topic);
      }
    );
  });
};

export const insertOrUpdate = async (
  relationship: { dealId?: string; pollId?: string; videoId?: string },
  topic: Topic
): Promise<void> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      insertOrUpdateTopicSQL,
      [
        topic.id,
        topic.commentCount,
        topic.createdAt,
        relationship.dealId || null,
        topic.url,
        topic.replyCount,
        relationship.pollId || null,
        relationship.videoId || null,
        topic.voteCount,
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
