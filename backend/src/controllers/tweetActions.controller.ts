import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import Like from "../models/like.model";
import Tweet from "../models/tweet.model";
import Retweet from "../models/retweet.model";
import { CustomRequest } from "../types/request.interface";

const validateTweetId = async (
  tweetId: string,
  next: NextFunction
): Promise<void> => {
  if (!tweetId || !isValidObjectId(tweetId)) {
    return next(errorHandler(404, "Invalid or missing tweet ID"));
  }

  const tweetExists = await Tweet.exists({ _id: tweetId });
  if (!tweetExists) {
    return next(errorHandler(404, "Tweet not found"));
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
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    await validateTweetId(tweetId, next);

    const like = await new Like({
      userId: req.user!.id,
      tweetId: tweetId,
    }).save();

    await updateTweetCount(tweetId, "likesCount", 1);

    res.status(200).json({ body: like });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(errorHandler(409, "Duplicate like request"));
    }
    next(error);
  }
};

export const unlikeTweet = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tweetId } = req.params;

    await validateTweetId(tweetId, next);

    const like = await Like.findOneAndDelete({
      userId: req.user!.id,
      tweetId: tweetId,
    });

    if (!like) {
      return next(errorHandler(404, "Like not found for tweet"));
    }

    await updateTweetCount(tweetId, "likesCount", -1);

    res.status(200).json({ message: "Unlike successful" });
  } catch (error) {
    next(error);
  }
};

export const retweetTweet = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    await validateTweetId(tweetId, next);

    const retweet = await new Retweet({
      userId: req.user!.id,
      tweetId: tweetId,
    }).save();

    await updateTweetCount(tweetId, "retweetCount", 1);

    res.status(200).json({ body: retweet });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(errorHandler(409, "Duplicate retweet request"));
    }
    next(error);
  }
};

export const unretweetTweet = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    await validateTweetId(tweetId, next);

    const retweet = await Retweet.findOneAndDelete({
      userId: req.user!.id,
      tweetId: tweetId,
    });

    if (!retweet) {
      return next(errorHandler(404, "Retweet not found for tweet"));
    }

    await updateTweetCount(tweetId, "retweetCount", -1);

    res.status(200).json({ message: "Unretweet successful" });
  } catch (error) {
    next(error);
  }
};
