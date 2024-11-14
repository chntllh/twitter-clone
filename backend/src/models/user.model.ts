import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<InterfaceUser>(
  {
    username: {
      type: String,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "Hey there!",
    },
    avatarUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXb4pT4uOsvRQYT4H9MI9TwfkMAMRHXWscAw&s",
    },
  },
  { timestamps: true }
);

userSchema.index({ username: 1, email: 1 });

userSchema.index({ createdAt: -1 });

const User: Model<InterfaceUser> = model("User", userSchema);

export default User;
