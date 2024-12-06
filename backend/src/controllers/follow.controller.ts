import mongoose, { isValidObjectId, ObjectId } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import Follower from "../models/follower.model";
import { NextFunction, Request, Response } from "express";
import User, { InterfaceUser } from "../models/user.model";
import { resolveUserId } from "../helper/userIdResolver";

export interface CustomRequest extends Request {
  user?: {
    id: ObjectId;
  };
}

interface FormattedRelation {
  userId: ObjectId;
  username: string;
  avatarUrl: string | undefined;
  displayName: string;
  bio?: string;
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
    const { identifier } = req.params;

    const userId: mongoose.Types.ObjectId = await resolveUserId(identifier);

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
    const { identifier } = req.params;

    const userId: mongoose.Types.ObjectId = await resolveUserId(identifier);

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
    const { identifier } = req.params;

    const userId: mongoose.Types.ObjectId = await resolveUserId(identifier);

    const followers = await Follower.find({ userId: userId })
      .populate<{ followerId: InterfaceUser }>(
        "followerId",
        "_id displayName username avatarUrl bio"
      )
      .lean();

    const formattedFollowers: FormattedRelation[] = followers.map(
      (follower) => ({
        userId: follower.followerId._id as ObjectId,
        username: follower.followerId.username,
        displayName: follower.followerId.displayName,
        avatarUrl: follower.followerId.avatarUrl,
        bio: follower.followerId.bio,
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
    const { identifier } = req.params;

    const userId: mongoose.Types.ObjectId = await resolveUserId(identifier);

    const follows = await Follower.find({ followerId: userId })
      .populate<{ userId: InterfaceUser }>(
        "userId",
        "_id displayName username avatarUrl bio"
      )
      .lean();

    const formattedFollowings: FormattedRelation[] = follows.map((follow) => ({
      userId: follow.userId._id as ObjectId,
      username: follow.userId.username,
      displayName: follow.userId.displayName,
      avatarUrl: follow.userId.avatarUrl,
      bio: follow.userId.bio,
    }));

    res.status(200).json(formattedFollowings);
  } catch (error) {
    next(error);
  }
};

export const isFollowing = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    const userId: mongoose.Types.ObjectId = await resolveUserId(identifier);

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
