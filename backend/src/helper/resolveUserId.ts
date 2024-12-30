import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import User from "../models/user.model";

export const resolveUserId = async (
  identifier: string | undefined
): Promise<mongoose.Types.ObjectId> => {
  if (!identifier) {
    throw errorHandler(404, "No identifier", {
      code: "NO_IDENTIFIER",
      description: "No identifier provided",
      field: "identifier",
    });
  }

  let user: { _id: mongoose.Types.ObjectId } | null;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    user = await User.findById(identifier)
      .select("_id")
      .lean<{ _id: mongoose.Types.ObjectId }>();
  } else {
    user = await User.findOne({ username: identifier })
      .select("_id")
      .lean<{ _id: mongoose.Types.ObjectId }>();
  }

  if (!user) {
    throw errorHandler(404, "No user", {
      code: "NO_USER",
      description: "User does not exist in DB",
      field: "user",
    });
  }

  return user._id;
};
