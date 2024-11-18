import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler";

export const test = (req: Request, res: Response) => {
  res.json({ message: "API is working!" });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(errorHandler(404, "User ID wrong"));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "No user found"));
    }

    const formattedUser = {
      userId: user._id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    next(error);
  }
};
