import { Document, model, Model, Schema } from "mongoose";

export interface InterfaceTweet extends Document {
  userId: Schema.Types.ObjectId;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tweetSchema = new Schema<InterfaceTweet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 256,
    },
    imageUrl: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

tweetSchema.index({ createdAt: -1 });

const Tweet: Model<InterfaceTweet> = model("Tweet", tweetSchema);

export default Tweet;
