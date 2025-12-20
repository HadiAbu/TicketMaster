import { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { BookingService } from "../services/booking.service";
import { authMiddleware } from "../middlewares/auth";
import { uuid } from "zod";

const router = Router();

// --- PUBLIC ROUTES ---

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const user = await AuthService.register(email, password, name);
    res.status(201).json({
      message: "New User created in DB",
      userId: user.id,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    res.json(data);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

// --- PROTECTED ROUTES ---

// Reserve a Ticket
router.post("/reserve", authMiddleware, async (req: any, res: Response) => {
  try {
    console.log(req.body);
    console.log(req.user);
    const { eventId } = req.body;
    const userId = req.user.userId;

    const ticket = await BookingService.reserveTicket(userId, eventId);
    res.json({ message: "Ticket reserved successfully", ticket });
  } catch (err: any) {
    const status = err.message.includes("WAITING_ROOM_FULL") ? 429 : 400;
    res.status(status).json({ error: err.message });
  }
});

export default router;
