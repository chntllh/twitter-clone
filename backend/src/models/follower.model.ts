import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceFollower extends Document {
  userId: Schema.Types.ObjectId;
  followerId: Schema.Types.ObjectId;
  followerAt: Date;
}

const followerSchema = new Schema<InterfaceFollower>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followerAt: {
    type: Date,
    default: Date.now,
  },
});

const Follower: Model<InterfaceFollower> = model("Follower", followerSchema);

export default Follower;
