import mongoose, { FilterQuery } from "mongoose";

export type TweetFilter = FilterQuery<{
  userId?: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] };
}>;

export type UserFilter = FilterQuery<{
  _id: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] };
}>;
