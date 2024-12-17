import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import { InterfaceUser } from "../models/user.model";
import { resolveUserId } from "../helper/resolveUserId";
import Tweet from "../models/tweet.model";
import Follower from "../models/follower.model";
import { extractHashtags } from "../helper/extractHashtags";
import Hashtag from "../models/hashtag.model";
import TweetHashtag from "../models/tweet-hashtag.model";
import { CustomRequest } from "../types/request.interface";
import { FormattedTweet } from "../types/tweet.interface";
import { formatTweet } from "../helper/formatTweet";
import { fetchTweets } from "../helper/fetchTweets";

export const postTweet = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { content, imageUrl } = req.body;

  if (!content) return next(errorHandler(400, "Content empty"));

  const tweetData = {
    userId: req.user!.id,
    content,
    ...(imageUrl && { imageUrl }),
  };

  try {
    const tweet = await new Tweet(tweetData).save();
    const hashtags = extractHashtags(content);

    for (const tag of hashtags) {
      const hashtagDoc = await Hashtag.findOneAndUpdate(
        { hashtag: tag },
        {},
        { new: true, upsert: true }
      );

      await new TweetHashtag({
        tweetId: tweet._id,
        hashtagId: hashtagDoc._id,
      }).save();
    }

    const populatedTweet = await Tweet.findById(tweet._id)
      .populate<{ userId: InterfaceUser }>(
        "userId",
        "username displayName avatarUrl"
      )
      .lean();

    if (!populatedTweet) return next(errorHandler(404, "Tweet not found"));

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
): Promise<void> => {
  try {
    const formattedTweets = await fetchTweets({}, req.user!.id);

    res.status(200).json(formattedTweets);
  } catch (error) {
    next(error);
  }
};

export const getUserTweets = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = await resolveUserId(req.params.identifier);
    const formattedTweets = await fetchTweets({ userId }, req.user!.id);

    res.status(200).json(formattedTweets);
  } catch (error) {
    next(error);
  }
};

export const getUserFollowingTweets = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = await resolveUserId(req.params.identifier);
    const following = await Follower.find({ followerId: userId })
      .select("userId")
      .lean();

    const followingUserIds = following.map((follow) => follow.userId);
    const formattedTweets = await fetchTweets(
      { userId: { $in: followingUserIds } },
      req.user!.id
    );

    res.status(200).json(formattedTweets);
  } catch (error) {
    next(error);
  }
};
