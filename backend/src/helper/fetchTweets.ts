import Like from "../models/like.model";
import Tweet from "../models/tweet.model";
import { InterfaceUser } from "../models/user.model";
import { formatTweet } from "./formatTweet";

export const fetchTweets = async (filter, userId) => {
  const tweets = await Tweet.find(filter)
    .populate<{ userId: InterfaceUser }>(
      "userId",
      "_id username displayName avatarUrl"
    )
    .sort("createdAt")
    .select("content imageUrl likesCount retweetCount createdAt userId")
    .lean();

  const likes = await Like.find({ userId }).select("tweetId");
  const userLikes = new Set(likes.map((like) => like.tweetId.toString()));

  return tweets.map((tweet) => ({
    ...formatTweet(tweet),
    liked: userLikes.has(tweet._id.toString()),
  }));
};
