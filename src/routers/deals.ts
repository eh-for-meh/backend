import fetch from "node-fetch";
import { Request, Response } from "express";
import * as DealsController from "../controllers/deals";
import * as DealThemesController from "../controllers/dealThemes";
import * as DealStoriesController from "../controllers/dealStories";
import { MEH_API_URL } from "../lib/constants";
import { MehAPIResponse } from "../lib/types";

const MEH_API_KEY: string | undefined = process.env.MEH_API_KEY;

export const getCurrent = async (_: Request, res: Response) => {
  if (typeof MEH_API_KEY === "undefined" || MEH_API_KEY.length === 0) {
    res.status(500).send();
    return;
  }
  try {
    const deal = await DealsController.getCurrent();
    res.status(200).json(deal);
  } catch (err) {
    switch (err.message) {
      case "No deal found!":
        res.status(404).send();
        break;
      default:
        console.error("[DEAL] getCurrent:", err);
        res.status(500).send();
        break;
    }
  }
};

export const updateCurrentDealInDatabase = async (
  _: Request,
  res: Response
) => {
  if (typeof MEH_API_KEY === "undefined" || MEH_API_KEY.length === 0) {
    res.status(500).send();
    return;
  }
  try {
    const response = await fetch(`${MEH_API_URL}?apikey=${MEH_API_KEY}`);
    if (response.status !== 200) {
      throw response;
    }
    const json = (await response.json()) as MehAPIResponse;
    json.deal.created_at = new Date().toISOString();
    await Promise.all([
      DealsController.insertOrUpdate(json.deal),
      DealThemesController.insertOrUpdate(json.deal.id, json.deal.theme),
      DealStoriesController.insertOrUpdate(json.deal.id, json.deal.story),
    ]);
    res.status(200).send();
  } catch (err) {
    console.error("[DEAL] getCurrent:", err);
    res.status(500).send();
  }
};
