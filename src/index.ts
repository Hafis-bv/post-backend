import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { authRouter } from "./routes/auth";
import cookieParser from "cookie-parser";
import { logger } from "./middleware/logger";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { postRouter } from "./routes/posts";
import cors from "cors";

// load envs
dotenv.config();

// connect to mongoDB
connectDB();

const app = express();

// middlewares
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// routes
app.use("/auth", authRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Hello world from auth api");
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Sever is running on http://localhost:${process.env.PORT}`);
});
