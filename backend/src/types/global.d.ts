import { Types } from "mongoose";
import { FilterQuery } from "mongoose";

export type TweetFilter = FilterQuery<{
  userId?: Types.ObjectId | { $in: Types.ObjectId[] };
}>;

export type UserFilter = FilterQuery<{
  _id: Types.ObjectId | { $in: Types.ObjectId[] };
}>;
