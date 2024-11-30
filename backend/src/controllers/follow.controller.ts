import mongoose, { isValidObjectId, ObjectId } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import Follower from "../models/follower.model";
import { NextFunction, Request, Response } from "express";
import User, { InterfaceUser } from "../models/user.model";

export interface CustomRequest extends Request {
  user?: {
    id: ObjectId;
  };
}

interface FormattedRelation {
  username: string;
  avatarUrl: string | undefined;
  displayName: string;
}

export const test = (req, res) => {
  res.json({ message: "follow api working" });
};

export const follow = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
      return next(errorHandler(404, "Invalid userId"));
    }

    if (!req.user) {
      return next(errorHandler(400, "No user"));
    }

    const follow = new Follower({
      userId: userId,
      followerId: req.user.id,
    });
    await follow.save();

    await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });
    await User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: 1 } });

    res.status(200).json({ body: follow });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(errorHandler(409, "Duplicate follow request"));
    }
    next(error);
  }
};

export const unfollow = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
      return next(errorHandler(404, "Invalid userId"));
    }

    if (!req.user) {
      return next(errorHandler(400, "No user"));
    }

    const deleteFollow = await Follower.findOneAndDelete({
      userId: userId,
      followerId: req.user.id,
    });

    if (!deleteFollow) {
      return next(errorHandler(404, "Follow not found for user"));
    }

    await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });
    await User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: -1 } });

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    next(error);
  }
};

export const followers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
      return next(errorHandler(404, "Invalid userId"));
    }

    const followers = await Follower.find({ userId: userId })
      .populate<{ followerId: InterfaceUser }>(
        "followerId",
        "displayName username avatarUrl"
      )
      .lean();

    const formattedFollowers: FormattedRelation[] = followers.map(
      (follower) => ({
        username: follower.followerId.username,
        displayName: follower.followerId.displayName,
        avatarUrl: follower.followerId.avatarUrl,
      })
    );

    res.status(200).json(formattedFollowers);
  } catch (error) {
    next(error);
  }
};

export const following = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(errorHandler(404, "Invalid userId"));
    }

    const follows = await Follower.find({ followerId: userId })
      .populate<{ userId: InterfaceUser }>(
        "userId",
        "displayName username avatarUrl"
      )
      .lean();

    const formattedFollowings: FormattedRelation[] = follows.map((follow) => ({
      username: follow.userId.username,
      displayName: follow.userId.displayName,
      avatarUrl: follow.userId.avatarUrl,
    }));

    res.status(200).json(formattedFollowings);
  } catch (error) {
    next(error);
  }
};

export const isFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
      return next(errorHandler(404, "Invalid userId"));
    }

    if (!req.user) {
      return next(errorHandler(400, "No user"));
    }

    const followExists = await Follower.findOne({
      userId,
      followerId: req.user.id,
    });

    res.status(200).json({
      isFollowing: !!followExists,
    });
  } catch (error) {
    next(error);
  }
};
