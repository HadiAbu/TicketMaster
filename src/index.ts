import express from "express";
import dotenv from "dotenv";
import { router as apiRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { connectRedis } from "./config/redis";

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

app.use(errorHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});

export default app;
