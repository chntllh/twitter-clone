import dotenv from "dotenv";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({ path: "../.env" });

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected!"))
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

app.listen(3000, () => console.log("Server running on port 3000"));

// Routes
import userRoutes from "./routes/user.routes";
app.use("/api/user", userRoutes);
import authRoutes from "./routes/auth.routes";
app.use("/api/auth", authRoutes);
import tweetRoutes from "./routes/tweet.routes";
app.use("/api/tweet", tweetRoutes);
import followRoutes from "./routes/follow.routes";
app.use("/api/follow", followRoutes);
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
