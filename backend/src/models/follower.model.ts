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
    index: true,
  },
  followerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  followerAt: {
    type: Date,
    default: Date.now,
  },
});

followerSchema.index({ userId: 1, followerId: 1 }, { unique: true });

followerSchema.index({ userId: 1 });

followerSchema.index({ followerId: 1 });

const Follower: Model<InterfaceFollower> = model("Follower", followerSchema);

export default Follower;
