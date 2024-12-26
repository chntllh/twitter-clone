import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler";
import User, { InterfaceUser } from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import { FormattedUser } from "../types/user.interface";
import { formatUser } from "../helper/formatUser";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (!emailRegex.test(email)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  const randomSuffix = crypto.randomBytes(3).toString("hex");
  const username = `${name.split(" ")[0].toLowerCase()}${randomSuffix}`;

  try {
    const hashedPassword: string = await bcryptjs.hash(password, 10);

    const newUser = await new User({
      displayName: name,
      username: username,
      email,
      passwordHash: hashedPassword,
    }).save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!);

    const userData: FormattedUser = formatUser(newUser.toObject());

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      })
      .json(userData);
  } catch (error: any) {
    if (error.code === 11000) {
      return next(errorHandler(409, "Email already exists"));
    }
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  const isEmail: boolean = emailRegex.test(identifier);

  try {
    const validUser = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );
    if (!validUser) {
      return next(errorHandler(400, "Invalid email/username or password"));
    }

    const validPassword: boolean = await bcryptjs.compare(
      password,
      validUser.passwordHash
    );
    if (!validPassword) {
      return next(errorHandler(400, "Invalid email/username or password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET!);

    const userData: FormattedUser = formatUser(validUser.toObject());

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

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
      const userData = formatUser(user.toObject());
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        .json(userData);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      const randomSuffix = crypto.randomBytes(3).toString("hex");
      const username = `${name.split(" ")[0].toLowerCase()}${randomSuffix}`;

      const newUser = await new User({
        username: username,
        displayName: name,
        passwordHash: hashedPassword,
        email: email,
        avatarUrl: googlePhotoUrl.replace(/s96-c/, "s400-c"),
      }).save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!);

      const userData: FormattedUser = formatUser(newUser.toObject());

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        .json(userData);
    }
  } catch (error) {
    next(error);
  }
};
