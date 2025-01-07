import mongoose from "mongoose";

export interface FormattedRelation {
  userId: mongoose.Types.ObjectId;
  username: string;
  avatarUrl: string | undefined;
  displayName: string;
  bio?: string;
}
