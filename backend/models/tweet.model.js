import { model, Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 256,
    },
  },
  { timestamps: true }
);

const Tweet = model('Tweet', tweetSchema);

export default Tweet;
