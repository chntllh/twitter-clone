import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler";
import User, { InterfaceUser } from "../models/user.model";
import { NextFunction, Request, Response } from "express";

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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const test = (req: Request, res: Response) => {
  res.json({ message: "Auth API path is working" });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body;

  if (
    !email ||
    !name ||
    !password ||
    email === "" ||
    name === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (!emailRegex.test(email)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  const randomSuffix = crypto.randomBytes(3).toString("hex");
  const username = `${name.split(" ")[0].toLowerCase()}${randomSuffix}`;

  try {
    const hashedPassword: string = await bcryptjs.hash(password, 10);

    const newUser = new User({
      displayName: name,
      username: username,
      email,
      passwordHash: hashedPassword,
    });

    if (!process.env.JWT_SECRET) {
      return next(errorHandler(500, "Internal server error"));
    }

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    const userData: FormattedUser = formatUser(newUser.toObject());

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
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
) => {
  const { identifier, password } = req.body;

  if (!identifier || !password || identifier === "" || password === "") {
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

    if (!process.env.JWT_SECRET) {
      return next(errorHandler(500, "Internal server error"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const userData: FormattedUser = formatUser(validUser.toObject());

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
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
) => {
  const { email, name, googlePhotoUrl } = req.body;

  if (!process.env.JWT_SECRET) {
    return next(errorHandler(500, "Internal server error"));
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const userData = formatUser(user.toObject());
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "strict",
        })
        .json(userData);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      const randomSuffix = crypto.randomBytes(3).toString("hex");
      const username = `${name.split(" ")[0].toLowerCase()}${randomSuffix}`;

      const newUser = new User({
        username: username,
        displayName: name,
        passwordHash: hashedPassword,
        email: email,
        avatarUrl: googlePhotoUrl,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      const userData: FormattedUser = formatUser(newUser.toObject());

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "strict",
        })
        .json(userData);
    }
  } catch (error) {
    next(error);
  }
};
