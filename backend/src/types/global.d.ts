import mongoose, { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: mongoose.Types.ObjectId;
    }
  }
}
