import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceTweetHashtag extends Document {
  tweetId: Schema.Types.ObjectId;
  hashtagId: Schema.Types.ObjectId;
  createdAt: Date;
}

const tweetHashtagSchema = new Schema<InterfaceTweetHashtag>({
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
    required: true,
    index: true,
  },
  hashtagId: {
    type: Schema.Types.ObjectId,
    ref: "Hashtag",
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

tweetHashtagSchema.index({ tweetId: 1, hashtagId: 1 });
tweetHashtagSchema.index({ hashtagId: 1 });

const TweetHashtag: Model<InterfaceTweetHashtag> = model(
  "TweetHashtag",
  tweetHashtagSchema
);

export default TweetHashtag;
