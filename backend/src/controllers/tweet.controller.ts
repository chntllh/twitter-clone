import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import User, { InterfaceUser } from "../models/user.model";
import { resolveUserId } from "../helper/resolveUserId";
import Tweet from "../models/tweet.model";
import Follower from "../models/follower.model";
import { extractHashtags } from "../helper/extractHashtags";
import Hashtag from "../models/hashtag.model";
import TweetHashtag from "../models/tweet-hashtag.model";
import { CustomRequest } from "../types/request.interface";
import { FormattedTweet } from "../types/tweet.interface";
import { formatTweet } from "../helper/formatTweet";
import { fetchTweetsAndRetweets } from "../helper/fetchTweetsAndRetweets";
import { extractMentions } from "../helper/extractMentions";
import Mention from "../models/mention.model";
import Notification from "../models/notification.model";
import { startSession } from "mongoose";

export const postTweet = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await startSession();
  let transactionCommitted = false;

  try {
    session.startTransaction();

    const { content, imageUrl } = req.body;

    if (!content) return next(errorHandler(400, "Content empty"));

    const tweetData = {
      userId: req.user!.id,
      content,
      ...(imageUrl && { imageUrl }),
    };

    const tweet = await new Tweet(tweetData).save({ session });

    try {
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
        }).save({ session });
      }
    } catch (error) {
      await session.abortTransaction();
      return next(errorHandler(500, "Error saving hashtags"));
    }

    try {
      const mentions = extractMentions(content);

      if (mentions) {
        const mentionedUsernames = mentions.map((mention): string =>
          mention.slice(1)
        );
        const mentionedUsers = await User.find({
          username: { $in: mentionedUsernames },
        })
          .select("_id")
          .lean();

        for (const user of mentionedUsers) {
          await new Mention({
            tweetId: tweet._id,
            mentionedUserId: user._id,
          }).save({ session });

          await new Notification({
            userId: user._id,
            actorId: req.user!.id,
            tweetId: tweet._id,
            notificationType: "Tweet mention",
          }).save({ session });
        }
      }
    } catch (error) {
      await session.abortTransaction();
      return next(errorHandler(500, "Error saving mentions"));
    }

    await session.commitTransaction();
    transactionCommitted = true;

    session.endSession();

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
    if (!transactionCommitted) await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getAllTweets = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const formattedTweets = await fetchTweetsAndRetweets({}, req.user!.id);

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
    const formattedTweets = await fetchTweetsAndRetweets(
      { userId },
      req.user!.id
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
): Promise<void> => {
  try {
    const userId = await resolveUserId(req.params.identifier);
    const following = await Follower.find({ followerId: userId })
      .select("userId")
      .lean();

    const followingUserIds = following.map((follow) => follow.userId);
    const formattedTweets = await fetchTweetsAndRetweets(
      { userId: { $in: followingUserIds } },
      req.user!.id
    );

    res.status(200).json(formattedTweets);
  } catch (error) {
    next(error);
  }
};
