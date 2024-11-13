import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceTweetHashtag extends Document {
  tweetId: Schema.Types.ObjectId;
  hashtagId: Schema.Types.ObjectId;
}

const tweetHashtagSchema = new Schema<InterfaceTweetHashtag>({
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
    required: true,
  },
  hashtagId: {
    type: Schema.Types.ObjectId,
    ref: "Hashtag",
    required: true,
  },
});

const TweetHashtag: Model<InterfaceTweetHashtag> = model(
  "TweetHashtag",
  tweetHashtagSchema
);

export default TweetHashtag;
