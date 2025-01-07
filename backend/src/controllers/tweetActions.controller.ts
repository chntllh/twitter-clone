import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import Like from "../models/like.model";
import Tweet from "../models/tweet.model";
import Retweet from "../models/retweet.model";

const validateTweetId = async (
  tweetId: string,
  next: NextFunction
): Promise<void> => {
  if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
    return next(
      errorHandler(404, "Invalid or missing tweet ID", {
        code: "TWEETID_ERROR",
        description: "Invalid or missing tweet ID",
        field: "tweetId",
      })
    );
  }

  const tweetExists = await Tweet.exists({ _id: tweetId });
  if (!tweetExists) {
    return next(
      errorHandler(404, "Tweet not found", {
        code: "TWEET_NOT_FOUND",
        description: "Tweet not found",
        field: "tweet",
      })
    );
  }
};

const updateTweetCount = async (
  tweetId: string,
  field: "likesCount" | "retweetCount",
  value: number
): Promise<void> => {
  await Tweet.findByIdAndUpdate(tweetId, { $inc: { [field]: value } });
};

export const likeTweet = async (
  req: Request<{ tweetId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tweetId }: { tweetId: string } = req.params;
    await validateTweetId(tweetId, next);

    const like = await new Like({
      userId: req.user,
      tweetId: tweetId,
    }).save();

    await updateTweetCount(tweetId, "likesCount", 1);

    res.status(200).json({ body: like });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(
        errorHandler(409, "Duplicate like request", {
          code: "DUPLICATE_LIKE",
          description: "Duplicate like request",
          field: "like",
        })
      );
    }
    next(error);
  }
};

export const unlikeTweet = async (
  req: Request<{ tweetId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tweetId }: { tweetId: string } = req.params;

    await validateTweetId(tweetId, next);

    const like = await Like.findOneAndDelete({
      userId: req.user,
      tweetId: tweetId,
    });

    if (!like) {
      return next(
        errorHandler(404, "Like not found for tweet", {
          code: "LIKE_NOT_FOUND",
          description: "Like not found for tweet",
          field: "like",
        })
      );
    }

    await updateTweetCount(tweetId, "likesCount", -1);

    res.status(200).json({ message: "Unlike successful" });
  } catch (error) {
    next(error);
  }
};

export const retweetTweet = async (
  req: Request<{ tweetId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tweetId }: { tweetId: string } = req.params;
    await validateTweetId(tweetId, next);

    const retweet = await new Retweet({
      userId: req.user,
      tweetId: tweetId,
    }).save();

    await updateTweetCount(tweetId, "retweetCount", 1);

    res.status(200).json({ body: retweet });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(
        errorHandler(409, "Duplicate retweet request", {
          code: "DUPLICATE_RETWEET",
          description: "Duplicate retweet request",
          field: "retweet",
        })
      );
    }
    next(error);
  }
};

export const unretweetTweet = async (
  req: Request<{ tweetId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tweetId }: { tweetId: string } = req.params;
    await validateTweetId(tweetId, next);

    const retweet = await Retweet.findOneAndDelete({
      userId: req.user,
      tweetId: tweetId,
    });

    if (!retweet) {
      return next(
        errorHandler(404, "Retweet not found for tweet", {
          code: "RETWEET_NOT_FOUND",
          description: "Retweet not found for tweet",
          field: "retweet",
        })
      );
    }

    await updateTweetCount(tweetId, "retweetCount", -1);

    res.status(200).json({ message: "Unretweet successful" });
  } catch (error) {
    next(error);
  }
};
