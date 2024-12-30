import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { isValidObjectId, Types } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { FormattedUser } from "../types/user.interface";
import { formatUser } from "../helper/formatUser";
import { CustomRequest } from "../types/request.interface";
import {
  validateBio,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../helper/validateUserFields";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return next(
        errorHandler(404, "No identifier", {
          code: "NO_IDENTIFIER",
          description: "No identifier provided",
          field: "identifier",
        })
      );
    }

    let query = isValidObjectId(identifier)
      ? { _id: identifier }
      : { username: identifier };

    const user = await User.findOne(query);

    if (!user) {
      return next(
        errorHandler(404, "No user found", {
          code: "NO_USER",
          description: "User does not exist in DB",
          field: "user",
        })
      );
    }

    res.status(200).json(formatUser(user));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(
      errorHandler(404, "Not valid user", {
        code: "INVALID_USER",
        description: "No valid user",
        field: "req.user",
      })
    );
  }

  try {
    const userId: Types.ObjectId = req.user.id;
    const {
      username,
      email,
      displayName,
      bio,
      avatarUrl,
      password,
      newPassword,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(
        errorHandler(404, "User not found", {
          code: "USER_NOT_FOUND",
          description: "Supplied UserID not found in DB",
          field: "req.user.id",
        })
      );
    }

    if (username) {
      await validateUsername(username, userId);
      user.username = username;
    }

    if (email) {
      await validateEmail(email, userId);
      user.email = email;
    }

    if (displayName) {
      await validateDisplayName(displayName);
      user.displayName = displayName.trim();
    }

    if (bio !== undefined) {
      await validateBio(bio);
      user.bio = bio;
    }

    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }

    if (password && newPassword) {
      await validatePassword(password, newPassword, user.passwordHash);
      user.passwordHash = await hash(newPassword, 10);
    }

    await user.save();

    const token = sign({ id: user.id }, process.env.JWT_SECRET!);

    const userData: FormattedUser = formatUser(user);

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      })
      .json(userData);
  } catch (error) {
    next(error);
  }
};
