import dotenv from "dotenv";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const logErrorAndExit = (message: string) => {
  console.error("\x1b[31m%s\x1b[0m", message);
  process.exit(1);
};

dotenv.config({ path: "../.env" });

if (!process.env.JWT_SECRET) {
  logErrorAndExit("JWT_SECRET is missing in the environment variables.");
}

let mongoUri: string;

if (process.env.NODE_ENV === "test") {
  if (!process.env.TEST_URI) {
    logErrorAndExit("TEST_URI is missing in the environment variables.");
  }
  mongoUri = process.env.TEST_URI as string;
} else {
  if (!process.env.MONGO_URI) {
    logErrorAndExit("MONGO_URI is missing in the environment variables.");
  }
  mongoUri = process.env.MONGO_URI as string;
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("\x1b[33m%s\x1b[0m", "MongoDB connected!"))
  .catch((err: any) => console.log(err));

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", "http://localhost:4173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
import searchRoutes from "./routes/search.routes";
app.use("/api/search", searchRoutes);

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
