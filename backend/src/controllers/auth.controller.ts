import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler";
import User, { InterfaceUser } from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import { FormattedUser } from "../types/user.interface";
import { formatUser } from "../utils/formatUser";
import {
  validateDisplayName,
  validateEmail,
} from "../helper/validateUserFields";
import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    email,
    name,
    password,
  }: { email: string; name: string; password: string } = req.body;

  if (!email || !name || !password) {
    return next(
      errorHandler(400, "All fields are required", {
        code: "MISSING_FIELDS",
        description: "Email, name or password is missing",
        field: "email name password",
      })
    );
  }

  if (!emailRegex.test(email)) {
    return next(
      errorHandler(400, "Invalid email format", {
        code: "INVALID_EMAIL",
        description: "Invalid email format",
        field: "email",
      })
    );
  }

  const randomSuffix: string = crypto.randomBytes(3).toString("hex");
  const username: string = `${name.split(" ")[0].toLowerCase()}${randomSuffix}`;

  try {
    const hashedPassword: string = await bcryptjs.hash(password, 10);

    const newUser: InterfaceUser = await new User({
      displayName: name,
      username: username,
      email,
      passwordHash: hashedPassword,
    }).save();

    const token: string = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET!
    );

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
      return next(
        errorHandler(409, "Email already exists", {
          code: "EMAIL_EXISTS",
          description: "Email already exists in DB",
          field: "email",
        })
      );
    }
    next(error);
  }
};

export const preRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email }: { name: string; email: string } = req.body;

  if (!email || !name) {
    return next(
      errorHandler(400, "All fields are required", {
        code: "FIELD_NOT_PROVIDED",
        description: "Name or Email not provided",
        field: "email name",
      })
    );
  }

  try {
    await Promise.all([validateEmail(email, null), validateDisplayName(name)]);

    res.status(200).json({ message: "Valid name and email" });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { identifier, password }: { identifier: string; password: string } =
    req.body;

  if (!identifier || !password) {
    return next(
      errorHandler(400, "All fields are required", {
        code: "FIELD_NOT_PROVIDED",
        description: "Email/username or password not provided",
        field: "identifier password",
      })
    );
  }

  const isEmail: boolean = emailRegex.test(identifier);

  try {
    const validUser: InterfaceUser | null = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );
    if (!validUser) {
      return next(
        errorHandler(400, "Invalid email/username", {
          code: "USER_NOT_FOUND",
          description: "User not found",
          field: "identifier",
        })
      );
    }

    const validPassword: boolean = await bcryptjs.compare(
      password,
      validUser.passwordHash
    );
    if (!validPassword) {
      return next(
        errorHandler(400, "Invalid email/username or password", {
          code: "PASSWORD_ERROR",
          description: "Password provided is incorrect",
          field: "password",
        })
      );
    }

    const token: string = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET!
    );

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

export const preLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { identifier }: { identifier: string } = req.body;

  if (!identifier) {
    return next(
      errorHandler(400, "Identifier is required", {
        code: "FIELD_NOT_PROVIDED",
        description: "Email or username not provided",
        field: "identifier",
      })
    );
  }

  const isEmail: boolean = emailRegex.test(identifier);

  try {
    const validUser: InterfaceUser | null = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );
    if (!validUser) {
      return next(
        errorHandler(400, "Email/username not found", {
          code: "USER_NOT_FOUND",
          description: "User not found",
          field: "identifier",
        })
      );
    }

    res
      .status(200)
      .json({ message: `${isEmail ? "Valid email." : "Valid username"}` });
  } catch (error) {
    next(error);
  }
};

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    email,
    name,
    googlePhotoUrl,
  }: { email: string; name: string; googlePhotoUrl: string } = req.body;

  try {
    const user: InterfaceUser | null = await User.findOne({ email });

    if (user) {
      const token: string = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
      const userData: FormattedUser = formatUser(user.toObject());
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        .json(userData);
    } else {
      const generatedPassword: string =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword: string = await bcryptjs.hash(generatedPassword, 10);

      const randomSuffix: string = crypto.randomBytes(3).toString("hex");
      const username: string = `${name
        .split(" ")[0]
        .toLowerCase()}${randomSuffix}`;

      const newUser: InterfaceUser = await new User({
        username: username,
        displayName: name,
        passwordHash: hashedPassword,
        email: email,
        avatarUrl: googlePhotoUrl.replace(/s96-c/, "s400-c"),
      }).save();

      const token: string = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET!
      );

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
