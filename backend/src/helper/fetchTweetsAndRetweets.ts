import { Types } from "mongoose";
import Like from "../models/like.model";
import Retweet from "../models/retweet.model";
import { FormattedTweet } from "../types/tweet.interface";
import { fetchTweet } from "./fetchTweet";
import { fetchUser } from "./fetchUser";
import { formatTweet } from "./formatTweet";
import { mergeTweetsAndRetweets } from "./mergeTweetsAndRetweets";
import { TweetFilter } from "../types/global";

export const fetchTweetsAndRetweets = async (
  filter: TweetFilter,
  userId: Types.ObjectId
) => {
  const [tweets, retweets, likesUser, retweetsUser] = await Promise.all([
    fetchTweet(filter),
    Retweet.find(filter).sort("-retweetedAt"),
    Like.find({ userId }).select("tweetId"),
    Retweet.find({ userId }).select("tweetId"),
  ]);

  const userLikes = new Set(likesUser.map((like) => like.tweetId.toString()));
  const userRetweets = new Set(
    retweetsUser.map((retweet) => retweet.tweetId.toString())
  );

  const formattedTweets: FormattedTweet[] = tweets.map((tweet) => ({
    ...formatTweet(tweet),
    liked: userLikes.has(tweet._id.toString()),
    retweeted: userRetweets.has(tweet._id.toString()),
  }));

  if (retweets.length > 0) {
    const retweetTweetIds = retweets.map((retweet) =>
      retweet.tweetId.toString()
    );
    const retweetUserIds = retweets.map((retweet) => retweet.userId.toString());

    const [retweetTweets, retweetUsers] = await Promise.all([
      fetchTweet({ _id: { $in: retweetTweetIds } }),
      fetchUser({ _id: { $in: retweetUserIds } }),
    ]);

    const retweetUsersById = new Map(
      retweetUsers.map((user) => [user._id.toString(), user])
    );
    const retweetTweetsById = new Map(
      retweetTweets.map((tweet) => [tweet._id.toString(), tweet])
    );

    const completeRetweets = retweets.map((retweet) => {
      const tweet = retweetTweetsById.get(retweet.tweetId.toString());
      const user = retweetUsersById.get(retweet.userId.toString());
      return {
        ...tweet,
        retweeter: {
          retweetId: retweet._id,
          ...user,
          retweetedAt: retweet.retweetedAt,
        },
      };
    });

    const formattedRetweets: FormattedTweet[] = completeRetweets.map(
      (tweet) => ({
        ...formatTweet(tweet),
        liked: userLikes.has(tweet._id!.toString()),
        retweeted: userRetweets.has(tweet._id!.toString()),
      })
    );

    return mergeTweetsAndRetweets(formattedTweets, formattedRetweets);
  }

  return formattedTweets;
};
