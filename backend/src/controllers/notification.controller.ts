import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/request.interface";
import { resolveUserId } from "../helper/resolveUserId";
import Notification from "../models/notification.model";
import { fetchTweetsAndRetweets } from "../helper/fetchTweetsAndRetweets";

export const getMentionNotification = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const notifications = await Notification.find({ userId }).select(
      "tweetId actorId"
    );

    const notificationTweets = notifications.map(
      (notification) => notification.tweetId
    );

    const tweets = await fetchTweetsAndRetweets(
      { _id: { $in: notificationTweets } },
      userId
    );

    res.status(200).json(tweets);
  } catch (error) {
    next(error);
  }
};
