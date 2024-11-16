import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import Tweet from "../models/tweet.model";
import mongoose, { isValidObjectId, ObjectId } from "mongoose";

export interface CustomRequest extends Request {
  user?: {
    id: ObjectId;
  };
}

export const test = (req, res) => {
  res.json({ message: "tweet api working" });
};

export const postTweet = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { content, imageUrl } = req.body;

  if (!content || content === "") {
    return next(errorHandler(400, "Content empty"));
  }

  if (!req.user) {
    return next(errorHandler(400, "No user"));
  }

  const tweetData = {
    userId: req.user.id,
    content,
    ...(imageUrl && { imageUrl }),
  };

  try {
    const tweet = new Tweet(tweetData);
    await tweet.save();

    res.status(200).json({ body: tweet });
  } catch (error) {
    next(error);
  }
};

export const getAllTweets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tweets = await Tweet.find()
      .populate("userId", "username avatarUrl")
      .sort("-createdAt");

    res.json(tweets);
  } catch (error) {
    next(error);
  }
};

export const getUserTweets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(errorHandler(400, "Not valid userId"));
    }

    const tweets = await Tweet.find({ userId: userId })
      .populate("userId", "_id displayName username avatarUrl")
      .sort("-createdAt");

    res.json(tweets);
  } catch (error) {
    next(error);
  }
};
