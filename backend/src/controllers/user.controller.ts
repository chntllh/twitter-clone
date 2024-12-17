import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { isValidObjectId, Types } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { FormattedUser } from "../types/user.interface";
import { formatUser } from "../helper/formatUser";
import { CustomRequest } from "../types/request.interface";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return next(errorHandler(404, "No identifier"));
    }

    let query = isValidObjectId(identifier)
      ? { _id: identifier }
      : { username: identifier };

    const user = await User.findOne(query);

    if (!user) {
      return next(errorHandler(404, "No user found"));
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
    return next(errorHandler(404, "Not valid user"));
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
      return next(errorHandler(404, "User not found"));
    }

    if (username) {
      const usernameExists = await User.exists({
        username,
        _id: { $ne: userId },
      });
      if (usernameExists) {
        return next(errorHandler(400, "Username already exists"));
      }
      if (username.length < 3 || username.length > 16) {
        return next(
          errorHandler(400, "Username must be between 3 and 16 characters.")
        );
      }
      if (username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"));
      }
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!usernameRegex.test(username)) {
        return next(errorHandler(400, "Username can only be alphanumeric"));
      }
      user.username = username;
    }

    if (email) {
      const emailExist = await User.exists({ email, _id: { $ne: userId } });
      if (emailExist) {
        return next(errorHandler(400, "Email already exists"));
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(errorHandler(400, "Invalid email format"));
      }
      user.email = email;
    }

    if (displayName) {
      const trimmed: string = displayName.trim();
      if (trimmed.length < 1 || trimmed.length > 50) {
        return next(
          errorHandler(400, "Name must be between 1 and 50 characters.")
        );
      }
      user.displayName = trimmed;
    }

    if (bio !== undefined) {
      if (bio.length > 160) {
        return next(errorHandler(400, "Bio must not exist 160 characters."));
      }
      user.bio = bio;
    }

    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }

    if (password && newPassword) {
      if (await compare(newPassword, user.passwordHash)) {
        return next(
          errorHandler(400, "Old password cannot be the same as old password")
        );
      }
      if (newPassword.length < 6) {
        return next(errorHandler(400, "Password must be over 6 characters"));
      }
      const validPassword: boolean = await compare(password, user.passwordHash);
      if (!validPassword) {
        return next(errorHandler(400, "Invalid password"));
      } else {
        const hashedPassword: string = await hash(newPassword, 10);
        user.passwordHash = hashedPassword;
      }
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
