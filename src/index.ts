import express from "express";
import dotenv from "dotenv";
import { router as apiRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { connectRedis } from "./config/redis";
import bookingRoutes from "./routes/booking.routes";

dotenv.config();

const requestLogger: express.RequestHandler = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

async function bootstrap() {
  await connectRedis();
}

bootstrap();

const app = express();

app.use(express.json());
app.use(requestLogger);

// Root route for browser checks or health probes
app.get("/", (req, res) => {
  res.json({ message: "TicketMaster API - visit /api for endpoints" });
});
app.use("/api", apiRouter);
// Mount all routes under /api
app.use("/booking", bookingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// --- START SERVER ---
async function start() {
  // await connectRedis();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

start();

export default app;
