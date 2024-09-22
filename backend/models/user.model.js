import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
    },
    bio: {
      type: String,
      default: 'Hey there!',
    },
    avatarUrl: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXb4pT4uOsvRQYT4H9MI9TwfkMAMRHXWscAw&s',
    },
  },
  { timestamps: true }
);

const User = model('User', userSchema);

export default User;
