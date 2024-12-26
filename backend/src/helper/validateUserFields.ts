import { Types } from "mongoose";
import { errorHandler } from "../middleware/errorHandler";
import User from "../models/user.model";
import { compare } from "bcryptjs";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 16;
const DISPLAY_NAME_MAX_LENGTH = 50;
const BIO_MAX_LENGTH = 160;
const PASSWORD_MIN_LENGTH = 6;

const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUsername = async (
  username: string,
  userId: Types.ObjectId
) => {
  if (
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH
  ) {
    throw errorHandler(400, "Username must be between 3 and 16 characters.", {
      code: "USERNAME_LENGTH_ERROR",
      description: "Invalid username length",
      field: "username",
    });
  }
  if (username.includes(" ")) {
    throw errorHandler(400, "Username cannot contain spaces", {
      code: "USERNAME_WHITESPACE_ERROR",
      description: "Username contains whitespace",
      field: "username",
    });
  }
  if (!USERNAME_REGEX.test(username)) {
    throw errorHandler(400, "Username can only be alphanumeric", {
      code: "USERNAME_ILLEGAL_CHARACTER_ERROR",
      description: "Invalid username characters",
      field: "username",
    });
  }
  const usernameExists = await User.exists({ username, _id: { $ne: userId } });
  if (usernameExists) {
    throw errorHandler(400, "Username already exists", {
      code: "USERNAME_EXISTS",
      description: "Duplicate username",
      field: "username",
    });
  }
};

export const validateEmail = async (email: string, userId: Types.ObjectId) => {
  if (!EMAIL_REGEX.test(email)) {
    throw errorHandler(400, "Invalid email format", {
      code: "INVALID_EMAIL",
      description: "Invalid email format",
      field: "email",
    });
  }
  const emailExists = await User.exists({ email, _id: { $ne: userId } });
  if (emailExists) {
    throw errorHandler(400, "Email already exists", {
      code: "EMAIL_EXISTS",
      description: "Duplicate email",
      field: "email",
    });
  }
};

export const validateDisplayName = async (displayName: string) => {
  const trimmed: string = displayName.trim();
  if (trimmed.length < 1 || trimmed.length > DISPLAY_NAME_MAX_LENGTH) {
    throw errorHandler(400, "Name must be between 1 and 50 characters.", {
      code: "NAME_LENGTH_ERROR",
      description: "Name must be between 1 and 50 characters.",
      field: "displayName",
    });
  }
};

export const validateBio = async (bio: string) => {
  if (bio.length > BIO_MAX_LENGTH) {
    throw errorHandler(400, "Bio must not exceed 160 characters.", {
      code: "BIO_LENGTH_ERROR",
      description: "Bio must not exceed 160 characters",
      field: "bio",
    });
  }
};

export const validatePassword = async (
  oldPassword: string | undefined,
  newPassword: string,
  currentPasswordHash: string
) => {
  if (oldPassword && !(await compare(oldPassword, currentPasswordHash))) {
    throw errorHandler(400, "Invalid password", {
      code: "INVALID_OLD_PASSWORD",
      description: "Invalid password",
      field: "password",
    });
  }
  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    throw errorHandler(400, "Password must be over 6 characters", {
      code: "PASSWORD_TOO_SHORT",
      description: "Password must be over 6 characters",
      field: "newPassword",
    });
  }
  if (await compare(newPassword, currentPasswordHash)) {
    throw errorHandler(400, "Old password cannot be the same as old password", {
      code: "PASSWORD_REUSED",
      description: "Old password cannot be the same as old password",
      field: "password newPassword",
    });
  }
};
