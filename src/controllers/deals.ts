import fetch from "node-fetch";
import { Request, Response } from "express";
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
    const json = await response.json() as MehAPIResponse;
    // TODO: write data to database
    res.status(200).json(json);
  } catch (err) {
    console.error("[DEAL] getCurrent:", err);
    res.status(500).send();
  }
};
