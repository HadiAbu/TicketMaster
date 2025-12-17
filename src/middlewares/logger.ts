import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const now = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
}
