import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceRetweet extends Document {
  userId: Schema.Types.ObjectId;
  tweetId: Schema.Types.ObjectId;
  retweetedAt: Date;
}

const retweetSchema = new Schema<InterfaceRetweet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
    required: true,
    index: true,
  },
  retweetedAt: {
    type: Date,
    default: Date.now,
  },
});

retweetSchema.index({ userId: 1, tweetId: 1 }, { unique: true });

const Retweet: Model<InterfaceRetweet> = model("Retweet", retweetSchema);

export default Retweet;
