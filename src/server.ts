import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from TypeScript + Express" });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
