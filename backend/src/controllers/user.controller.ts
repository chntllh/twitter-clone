import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { isValidObjectId } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";

interface FormattedUser {
  userId: string;
  username: string;
  displayName: string;
  bio: string | undefined;
  avatarUrl: string;
  followersCount: number;
  followingCount: number;
  createdAt: Date;
}

const formatUser = (user: any): FormattedUser => ({
  userId: user._id,
  username: user.username,
  displayName: user.displayName,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  followersCount: user.followersCount,
  followingCount: user.followingCount,
  createdAt: user.createdAt,
});

export const test = (req: Request, res: Response) => {
  res.json({ message: "API is working!" });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { identifier } = req.params;

    let query = {};

    if (!identifier) {
      return next(errorHandler(404, "No identifier"));
    }

    if (isValidObjectId(identifier)) {
      query = { _id: identifier };
    } else {
      query = { username: identifier };
    }

    const user = await User.findOne(query);

    if (!user) {
      return next(errorHandler(404, "No user found"));
    }

    const formattedUser: FormattedUser = formatUser(user);

    res.status(200).json(formattedUser);
  } catch (error) {
    next(error);
  }
};
