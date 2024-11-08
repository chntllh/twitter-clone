import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middleware/errorHandler";
import User from "../models/user.model";
import { NextFunction, Request, Response } from "express";

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  const randomSuffix = crypto.randomBytes(3).toString("hex"); // Generates a 6-character random string
  const username = `${name.split(" ")[0].toLowerCase()}${randomSuffix}`; // Take the first part of the name and add the suffix

  const hashedPassword: string = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    displayName: name,
    username: username,
    email,
    passwordHash: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(200).json({ message: "Signup successful" });
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail = emailRegex.test(identifier);

  try {
    const validUser = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );
    if (!validUser) {
      return next(errorHandler(400, "Invalid email/username or password"));
    }

    const validPassword = bcryptjs.compareSync(
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

    const userData = validUser.toObject();
    const { passwordHash: pass, ...rest } = userData;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};