import { Request, Response, NextFunction } from "express";
import * as LoggerController from "./controllers/logger";

export const useragent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { path } = req;
  if (req.useragent === undefined) {
    res.status(403).send();
  } else {
    try {
      await LoggerController.insertRouteLog(path, req.useragent);
      next();
    } catch (err) {
      console.error("[MIDDLEWARE] useragent:", err);
      res.status(500).send();
    }
  }
};
