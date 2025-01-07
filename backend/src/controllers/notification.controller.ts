import { NextFunction, Request, Response } from "express";
import Notification, {
  InterfaceNotification,
} from "../models/notification.model";
import { fetchTweetsAndRetweets } from "../helper/fetchTweetsAndRetweets";
import mongoose from "mongoose";
import { InterfaceTweet } from "../models/tweet.model";
import { FormattedTweet } from "../types/tweet.interface";

export const getMentionNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId: mongoose.Types.ObjectId = req.user;

    const notifications: InterfaceNotification[] = await Notification.find({
      userId,
    }).select("tweetId actorId");

    const notificationTweets = notifications.map(
      (notification) => notification.tweetId
    );

    const tweets: FormattedTweet[] = await fetchTweetsAndRetweets(
      { _id: { $in: notificationTweets } },
      userId
    );

    res.status(200).json(tweets);
  } catch (error) {
    next(error);
  }
};
