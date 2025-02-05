import { NextFunction, Request, Response } from "express";
import Hashtag, { InterfaceHashtag } from "../models/hashtag.model";
import TweetHashtag from "../models/tweet-hashtag.model";
import { errorHandler } from "../middleware/errorHandler";
import Tweet from "../models/tweet.model";
import { InterfaceUser } from "../models/user.model";
import Like from "../models/like.model";
import { FormatHashtag } from "../types/search.interface";
import { formatTweet } from "../utils/formatTweet";
import { FormattedTweet } from "../types/tweet.interface";
import { formatHashtag } from "../utils/formatHashtag";

export const getAllHashtags = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hashtags = await Hashtag.find();

    const formatHashtags: FormatHashtag[] = hashtags.map(
      (hashtag): FormatHashtag => formatHashtag(hashtag)
    );

    res.status(200).json(formatHashtags);
  } catch (error) {
    next(error);
  }
};

export const getHashtagTweets = async (
  req: Request<{ hashtag: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { hashtag } = req.params;

  if (!hashtag || hashtag === "") {
    return next(
      errorHandler(400, "No hashtag given", {
        code: "HASHTAG_NOT_PROVIDED",
        description: "Hashtag not provided",
        field: "hashtag",
      })
    );
  }

  try {
    const hashtagDoc: InterfaceHashtag | null = await Hashtag.findOne(
      { hashtag: `#${hashtag.trim().toLowerCase()}` },
      { _id: 1 }
    );

    if (!hashtagDoc) {
      res.status(200).json([]);
    }

    const hashtagTweets = await TweetHashtag.find(
      {
        hashtagId: hashtagDoc,
      },
      { tweetId: 1, _id: 0 }
    );

    const tweetIds = hashtagTweets.map((doc) => doc.tweetId);

    const tweets = await Tweet.find({ _id: { $in: tweetIds } })
      .populate<{ userId: InterfaceUser }>(
        "userId",
        "username displayName avatarUrl"
      )
      .sort("-createdAt")
      .lean();

    const likes = await Like.find({ userId: req.user }).select("tweetId");
    const userLikes = new Set(likes.map((like) => like.tweetId.toString()));

    const formattedTweets: FormattedTweet[] = tweets.map((tweet) => ({
      ...formatTweet(tweet),
      liked: userLikes.has(tweet._id.toString()),
    }));

    res.status(200).json(formattedTweets);
  } catch (error) {
    next(error);
  }
};
