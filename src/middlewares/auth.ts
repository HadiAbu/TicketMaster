import { AuthService } from "../services/auth.service";
// Example of how the middleware logic works
export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) throw new Error("Unauthorized");

    const decoded = AuthService.verifyToken(token);
    req.userId = decoded.userId; // Pass userId to the next function
    next();
  } catch (err) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
