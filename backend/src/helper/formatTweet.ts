import { FormattedTweet } from "../types/tweet.interface";

export const formatTweet = (tweet: any): FormattedTweet => ({
  tweetId: tweet._id.toString(),
  userId: tweet.userId._id.toString(),
  avatarUrl: tweet.userId.avatarUrl,
  displayName: tweet.userId.displayName,
  username: tweet.userId.username,
  content: tweet.content,
  imageUrl: tweet.imageUrl,
  likesCount: tweet.likesCount,
  retweetCount: tweet.retweetCount,
  createdAt: tweet.createdAt,
});
