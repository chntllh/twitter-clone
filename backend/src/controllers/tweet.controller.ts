import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../middleware/errorHandler";
import User, { InterfaceUser } from "../models/user.model";
import { resolveUserId } from "../helper/resolveUserId";
import Tweet, { InterfaceTweet } from "../models/tweet.model";
import Follower from "../models/follower.model";
import { extractHashtags } from "../utils/extractHashtags";
import Hashtag from "../models/hashtag.model";
import TweetHashtag from "../models/tweet-hashtag.model";
import { FormattedTweet } from "../types/tweet.interface";
import { formatTweet } from "../utils/formatTweet";
import { fetchTweetsAndRetweets } from "../helper/fetchTweetsAndRetweets";
import { extractMentions } from "../utils/extractMentions";
import Mention from "../models/mention.model";
import Notification from "../models/notification.model";
import mongoose from "mongoose";

export const postTweet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session: mongoose.mongo.ClientSession = await mongoose.startSession();
  let transactionCommitted: boolean = false;

  try {
    session.startTransaction();

    const { content, imageUrl }: { content: string; imageUrl: string } =
      req.body;

    if (!content)
      return next(
        errorHandler(400, "Content empty", {
          code: "CONTENT_EMPTY",
          description: "Content of post empty",
          field: "content",
        })
      );

    const tweetData: Partial<InterfaceTweet> = {
      userId: req.user,
      content,
      ...(imageUrl && { imageUrl }),
    };

    const tweet: InterfaceTweet = await new Tweet(tweetData).save({ session });

    try {
      const hashtags: string[] = extractHashtags(content);

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
      return next(
        errorHandler(500, "Error saving hashtags", {
          code: "HASHTAG_ERROR",
          description: "Error saving hashtags",
          field: "hashtag",
        })
      );
    }

    try {
      const mentions: string[] = extractMentions(content);

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
            actorId: req.user,
            tweetId: tweet._id,
            notificationType: "Tweet mention",
          }).save({ session });
        }
      }
    } catch (error) {
      await session.abortTransaction();
      return next(
        errorHandler(500, "Error saving mentions", {
          code: "MENTION_ERROR",
          description: "Error saving mentions",
          field: "mention",
        })
      );
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

    if (!populatedTweet)
      return next(
        errorHandler(404, "Tweet not found", {
          code: "TWEET_NOT_FOUND",
          description: "Tweet not found",
          field: "tweet",
        })
      );

    const formattedTweet: FormattedTweet = formatTweet(populatedTweet);

    res.status(200).json(formattedTweet);
  } catch (error) {
    if (!transactionCommitted) await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getTweets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, identifier } = req.query;

    let filter = {};

    if (type === "user" && identifier) {
      const userId: mongoose.Types.ObjectId = await resolveUserId(
        identifier as string
      );
      filter = { userId };
    } else if (type === "following" && identifier) {
      const userId: mongoose.Types.ObjectId = await resolveUserId(
        identifier as string
      );
      const following = await Follower.find({ followerId: userId })
        .select("userId")
        .lean();
      const followingUserIds = following.map((follow) => follow.userId);
      filter = { userId: { $in: followingUserIds } };
    }

    const formattedTweet = await fetchTweetsAndRetweets(filter, req.user);
    res.status(200).json(formattedTweet);
  } catch (error) {
    next(error);
  }
};
