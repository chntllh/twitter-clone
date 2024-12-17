import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import User from "../models/user.model";

export const resolveUserId = async (
  identifier: string | undefined
): Promise<mongoose.Types.ObjectId> => {
  if (!identifier) {
    throw errorHandler(404, "No identifier");
  }

  let user: any;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    user = await User.findById(identifier).select("_id").lean();
  } else {
    user = await User.findOne({ username: identifier }).select("_id").lean();
  }

  if (!user) {
    throw errorHandler(404, "No user");
  }

  return user._id;
};