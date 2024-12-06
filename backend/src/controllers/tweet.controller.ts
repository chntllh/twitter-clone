import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import { InterfaceUser } from "../models/user.model";
import { resolveUserId } from "../helper/userIdResolver";
import Tweet from "../models/tweet.model";
import Follower from "../models/follower.model";

export interface CustomRequest extends Request {
  user?: {
    id: ObjectId;
  };
}

interface FormattedTweet {
  tweetId: string;
  userId: string;
  avatarUrl?: string;
  displayName: string;
  username: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  retweetCount: number;
  createdAt: Date;
}

const formatTweet = (tweet: any): FormattedTweet => ({
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

    const populatedTweet = await Tweet.findById(tweet._id)
      .populate<{ userId: InterfaceUser }>(
        "userId",
        "username displayName avatarUrl"
      )
      .lean();

    if (!populatedTweet) {
      return next(errorHandler(404, "Tweet not found"));
    }

    const formattedTweet: FormattedTweet = formatTweet(populatedTweet);

    res.status(200).json(formattedTweet);
  } catch (error) {
    next(error);
  }
};

export const getAllTweets = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tweets = await Tweet.find()
      .populate<{ userId: InterfaceUser }>(
        "userId",
        "_id username displayName avatarUrl"
      )
      .sort("-createdAt")
      .select("content imageUrl likesCount retweetCount createdAt userId")
      .lean();

    const formattedTweets: FormattedTweet[] = tweets.map((tweet) =>
      formatTweet(tweet)
    );

    res.status(200).json(formattedTweets);
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
    const { identifier } = req.params;

    const userId: mongoose.Types.ObjectId = await resolveUserId(identifier);

    const tweets = await Tweet.find({ userId: userId })
      .populate<{ userId: InterfaceUser }>(
        "userId",
        "_id displayName username avatarUrl"
      )
      .sort("-createdAt")
      .select("content imageUrl likesCount retweetCount createdAt userId")
      .lean();

    const formattedTweets: FormattedTweet[] = tweets.map((tweet) =>
      formatTweet(tweet)
    );

    res.status(200).json(formattedTweets);
  } catch (error) {
    next(error);
  }
};

export const getUserFollowingTweets = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { identifier } = req.params;

    const userId: mongoose.Types.ObjectId = await resolveUserId(identifier);

    const following = await Follower.find({ followerId: userId })
      .select("userId")
      .lean();
    const followingUserIds = following.map((follow) => follow.userId);

    const tweets = await Tweet.find({ userId: { $in: followingUserIds } })
      .populate<{ userId: InterfaceUser }>(
        "userId",
        "_id username displayName avatarUrl"
      )
      .sort({ createdAt: -1 })
      .select("content imageUrl likesCount retweetCount createdAt userId")
      .lean();

    const formattedTweet: FormattedTweet[] = tweets.map((tweet) =>
      formatTweet(tweet)
    );

    res.status(200).json(formattedTweet);
  } catch (error) {
    next(error);
  }
};
