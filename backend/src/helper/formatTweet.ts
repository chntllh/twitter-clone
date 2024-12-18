import { FormattedTweet } from "../types/tweet.interface";

export const formatTweet = (tweet: any): FormattedTweet => {
  return {
    tweet: {
      tweetId: tweet._id.toString(),
      content: tweet.content,
      imageUrl: tweet.imageUrl,
      likesCount: tweet.likesCount,
      retweetCount: tweet.retweetCount,
      createdAt: tweet.createdAt,
    },
    user: {
      userId: tweet.userId._id.toString(),
      avatarUrl: tweet.userId.avatarUrl,
      displayName: tweet.userId.displayName,
      username: tweet.userId.username,
    },
    retweeter: tweet.retweeter
      ? {
          retweetId: tweet.retweeter.retweetId,
          userId: tweet.retweeter._id.toString(),
          avatarUrl: tweet.retweeter.avatarUrl,
          displayName: tweet.retweeter.displayName,
          username: tweet.retweeter.username,
          retweetedAt: tweet.retweeter.retweetedAt,
        }
      : undefined,
  };
};
