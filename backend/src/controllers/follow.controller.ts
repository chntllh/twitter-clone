import mongoose, { ObjectId } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import Follower from "../models/follower.model";
import { NextFunction, Request, Response } from "express";
import User, { InterfaceUser } from "../models/user.model";
import { resolveUserId } from "../helper/resolveUserId";
import { CustomRequest } from "../types/request.interface";
import { FormattedRelation } from "../types/follow.interface";

const updateFollowCounts = async (
  userId: mongoose.Types.ObjectId,
  followerId: mongoose.Types.ObjectId,
  increment: boolean
): Promise<void> => {
  const value = increment ? 1 : -1;
  await Promise.all([
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: value } }),
    await User.findByIdAndUpdate(followerId, {
      $inc: { followingCount: value },
    }),
  ]);
};

export const follow = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId: mongoose.Types.ObjectId = await resolveUserId(
      req.params.identifier
    );

    const follow = await new Follower({
      userId,
      followerId: req.user!.id,
    }).save();

    await updateFollowCounts(userId, req.user!.id, true);

    res.status(200).json(follow);
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
): Promise<void> => {
  try {
    const userId: mongoose.Types.ObjectId = await resolveUserId(
      req.params.identifier
    );

    const deleteFollow = await Follower.findOneAndDelete({
      userId: userId,
      followerId: req.user!.id,
    });

    if (!deleteFollow) {
      return next(errorHandler(404, "Follow not found for user"));
    }

    await updateFollowCounts(userId, req.user!.id, false);

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    next(error);
  }
};

export const followers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId: mongoose.Types.ObjectId = await resolveUserId(
      req.params.identifier
    );

    const followers = await Follower.find({ userId })
      .populate<{ followerId: InterfaceUser }>(
        "followerId",
        "_id displayName username avatarUrl bio"
      )
      .lean();

    const formattedFollowers: FormattedRelation[] = followers.map(
      (follower) => ({
        userId: follower.followerId._id.toString(),
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
): Promise<void> => {
  try {
    const userId: mongoose.Types.ObjectId = await resolveUserId(
      req.params.identifier
    );

    const follows = await Follower.find({ followerId: userId })
      .populate<{ userId: InterfaceUser }>(
        "userId",
        "_id displayName username avatarUrl bio"
      )
      .lean();

    const formattedFollowings: FormattedRelation[] = follows.map((follow) => ({
      userId: follow.userId._id.toString(),
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

export const isFollowing = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId: mongoose.Types.ObjectId = await resolveUserId(
      req.params.identifier
    );

    const followExists = await Follower.findOne({
      userId,
      followerId: req.user!.id,
    });

    res.status(200).json(!!followExists);
  } catch (error) {
    next(error);
  }
};
