import dotenv from "dotenv";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";

dotenv.config({ path: "../.env" });

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected!"))
  .catch((err: any) => console.log(err));

const app = express();
app.use(express.json());

app.listen(3000, () => console.log("Server running on port 3000"));

// Routes

import userRoutes from "./routes/user.routes";
app.use("/api/user", userRoutes);
import authRoutes from "./routes/auth.routes";
app.use("/api/auth", authRoutes);

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
