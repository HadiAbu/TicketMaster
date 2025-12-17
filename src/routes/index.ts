import { Request, Response, Router } from "express";
import healthController from "../controllers/healthController";

const router = Router();

router.get("/", healthController.getRoot);
router.get("/health", healthController.getHealth);

export { router };
