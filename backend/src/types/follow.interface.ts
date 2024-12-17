import { ObjectId } from "mongoose";

export interface FormattedRelation {
  userId: ObjectId;
  username: string;
  avatarUrl: string | undefined;
  displayName: string;
  bio?: string;
}
