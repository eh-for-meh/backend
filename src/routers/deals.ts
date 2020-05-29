import fetch from "node-fetch";
import { Request, Response } from "express";
import * as DealsController from "../controllers/deals";
import { MEH_API_URL } from "../lib/constants";
import { MehAPIResponse } from "../lib/types";

const MEH_API_KEY: string | undefined = process.env.MEH_API_KEY;

export const getCurrent = async (_: Request, res: Response) => {
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
    await DealsController.insertOrUpdate(json.deal);
    // TODO: write other json to database
    res.status(200).json(json);
  } catch (err) {
    console.error("[DEAL] getCurrent:", err);
    res.status(500).send();
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
    await DealsController.insertOrUpdate(json.deal);
    res.status(200).send();
  } catch (err) {
    console.error("[DEAL] getCurrent:", err);
    res.status(500).send();
  }
};
