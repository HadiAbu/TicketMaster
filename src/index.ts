import express from "express";
import dotenv from "dotenv";
import { router as apiRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const requestLogger: express.RequestHandler = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use("/api", apiRouter);

app.use(errorHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});

export default app;
