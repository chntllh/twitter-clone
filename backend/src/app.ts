import dotenv from "dotenv";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const logErrorAndExit = (message) => {
  console.error("\x1b[31m%s\x1b[0m", message);
  process.exit(1);
};

const validateEnv = () => {
  if (!process.env.JWT_SECRET) {
    logErrorAndExit("JWT_SECRET is missing in the environment variables.");
  }
  if (!process.env.MONGO_URI) {
    logErrorAndExit("MONGO_URI is missing in the environment variables.");
  }
};

dotenv.config({ path: "../.env" });
validateEnv();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("\x1b[33m%s\x1b[0m", "MongoDB connected!"))
  .catch((err: any) => console.log(err));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.listen(3000, () =>
  console.log("\x1b[33m%s\x1b[0m", "Server running on port 3000")
);

// Routes
import authRoutes from "./routes/auth.routes";
app.use("/api/auth", authRoutes);
import userRoutes from "./routes/user.routes";
app.use("/api/user", userRoutes);
import tweetRoutes from "./routes/tweet.routes";
app.use("/api/tweet", tweetRoutes);
import tweetActionsRoutes from "./routes/tweetActions.routes";
app.use("/api/actions", tweetActionsRoutes);

// Middleware
app.use(
  (
    error: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
);

export default app;
