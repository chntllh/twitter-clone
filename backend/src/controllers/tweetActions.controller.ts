import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import Like from "../models/like.model";
import Tweet from "../models/tweet.model";
import Retweet from "../models/retweet.model";

export interface CustomRequest extends Request {
  user?: {
    id: ObjectId;
  };
}

export const test = (req, res) => {
  res.json({ message: "tweet action api working" });
};

export const likeTweet = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
      return next(errorHandler(404, "Tweet not found"));
    }

    if (!req.user) {
      return next(errorHandler(400, "No user"));
    }

    const like = new Like({
      userId: req.user.id,
      tweetId: tweetId,
    });
    await like.save();

    await Tweet.findByIdAndUpdate(tweetId, { $inc: { likesCount: 1 } });

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
) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
      return next(errorHandler(404, "Tweet not found"));
    }

    if (!req.user) {
      return next(errorHandler(400, "No user"));
    }

    const deleteLike = await Like.findOneAndDelete({
      userId: req.user.id,
      tweetId: tweetId,
    });

    if (!deleteLike) {
      return next(errorHandler(404, "Like not found for tweet"));
    }

    await Tweet.findByIdAndUpdate(tweetId, { $inc: { likesCount: -1 } });

    res.status(200).json({ message: "Unlike successful" });
  } catch (error) {
    next(error);
  }
};

export const retweetTweet = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
      return next(errorHandler(404, "Tweet not found"));
    }

    if (!req.user) {
      return next(errorHandler(400, "No user"));
    }

    const retweet = new Retweet({
      userId: req.user.id,
      tweetId: tweetId,
    });
    await retweet.save();

    await Retweet.findByIdAndUpdate(tweetId, { $inc: { retweetCount: 1 } });

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
) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
      return next(errorHandler(404, "Tweet not found"));
    }

    if (!req.user) {
      return next(errorHandler(400, "No user"));
    }

    const deleteRetweet = await Retweet.findOneAndDelete({
      userId: req.user.id,
      tweetId: tweetId,
    });

    if (!deleteRetweet) {
      return next(errorHandler(404, "Retweet not found for tweet"));
    }

    await Tweet.findByIdAndUpdate(tweetId, { $inc: { retweetCount: -1 } });

    res.status(200).json({ message: "Unretweet successful" });
  } catch (error) {
    next(error);
  }
};
