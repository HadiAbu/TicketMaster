import { Request, Response, NextFunction } from "express";
import HealthService from "../services/healthService";

const getRoot = (req: Request, res: Response) => {
  res.json({ message: "Welcome to TicketMaster API" });
};

const getHealth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = HealthService.getStatus();
    res.json(status);
  } catch (err) {
    next(err);
  }
};

export default { getRoot, getHealth };
