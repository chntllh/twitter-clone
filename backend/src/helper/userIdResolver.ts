import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import User from "../models/user.model";

export const resolveUserId = async (
  identifier: string | undefined
): Promise<mongoose.Types.ObjectId> => {
  if (!identifier) {
    throw errorHandler(404, "No identifier");
  }

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return new mongoose.Types.ObjectId(identifier);
  }

  const user = await User.findOne({ username: identifier });
  if (!user) {
    throw errorHandler(404, "No user");
  }

  return user.id as mongoose.Types.ObjectId;
};
