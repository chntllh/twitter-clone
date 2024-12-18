import Tweet from "../models/tweet.model";
import { InterfaceUser } from "../models/user.model";

export const fetchTweet = async (filter) => {
  return await Tweet.find(filter)
    .populate<{ userId: InterfaceUser }>(
      "userId",
      "_id username displayName avatarUrl"
    )
    .sort("-createdAt")
    .select("content imageUrl likesCount retweetCount createdAt userId")
    .lean();
};
