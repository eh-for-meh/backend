import { QueryResult } from "pg";
import { getClient, toTimestamp } from "./database";
import { Deal } from "../lib/types";

export const getCurrent = async (): Promise<Deal> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      `SELECT deals.created_at, deals.features, deals.id, deals.photo_urls as photos, deals.sold_out_at as soldOutAt, deals.specifications, deals.title, deals.url, deal_themes.accent_color as accentColor, deal_themes.background_color as backgroundColor, deal_themes.background_photo_url as backgroundImage, deal_themes.foreground as foreground, deal_stories.body as storyBody, deal_stories.title as storyTitle FROM deals
      JOIN deal_themes ON deals.id = deal_themes.deal_id
      JOIN deal_stories ON deals.id = deal_stories.deal_id
      WHERE created_at IS NOT NULL ORDER BY created_at DESC LIMIT 1;`,
      async (err: Error, result: QueryResult) => {
        client.release(true);
        if (err) {
          reject(err);
        } else if (result.rowCount === 0) {
          reject(new Error("No deal found!"));
        } else {
          const data = result.rows[0];
          const deal: Deal = {
            created_at: data.created_at,
            features: data.features,
            id: data.id,
            launches: [],
            items: [],
            photos: data.photos,
            soldOutAt: data.soldOutAt,
            specifications: data.specifications,
            theme: {
              accentColor: data.accentColor,
              backgroundColor: data.backgroundColor,
              backgroundImage: data.backgroundImage,
              foreground: data.foreground,
            },
            title: data.title,
            topic: {
              id: "",
              createdAt: "",
              commentCount: 0,
              replyCount: 0,
              voteCount: 0,
              url: ""
            },
            story: {
              body: data.storyBody,
              title: data.storyTitle
            },
            url: data.url
          };
          resolve(deal);
        }
      }
    );
  });
};

export const insertOrUpdate = async (deal: Deal): Promise<unknown[]> => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.query(
      `INSERT INTO deals(id, created_at, features, form_url, photo_urls, sold_out_at, specifications, title) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id)
      DO UPDATE SET features = $3, form_url = $4, photo_urls = $5, sold_out_at = $6, specifications = $7, title = $8;`,
      [
        deal.id,
        // TODO: Determine method of obtaining when a deal starts
        toTimestamp(deal.created_at),
        deal.features.toString(),
        deal.url,
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
