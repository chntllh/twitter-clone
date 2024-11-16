import mongoose, { ObjectId } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import Follower from "../models/follower.model";
import { NextFunction, Request, Response } from "express";

export interface CustomRequest extends Request {
  user?: {
    id: ObjectId;
  };
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

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(errorHandler(404, "User not found"));
    }

    if (!req.user) {
      return next(errorHandler(400, "No user"));
    }

    const follow = new Follower({
      userId: req.user.id,
      followerId: userId,
    });
    await follow.save();

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

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(errorHandler(404, "User not found"));
    }

    if (!req.user) {
      return next(errorHandler(400, "No user"));
    }

    await Follower.findOneAndDelete({
      userId: req.user.id,
      followerId: userId,
    });
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

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(errorHandler(404, "User not found"));
    }

    const followers = await Follower.find({ userId: userId }).populate(
      "followerId",
      "displayName username avatarUrl"
    );

    res.status(200).json(followers);
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
      return next(errorHandler(404, "User not found"));
    }

    const followers = await Follower.find({ followerId: userId }).populate(
      "userId",
      "displayName username avatarUrl"
    );

    res.status(200).json(followers);
  } catch (error) {
    next(error);
  }
};
