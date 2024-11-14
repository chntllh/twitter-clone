import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceLike extends Document {
  userId: Schema.Types.ObjectId;
  tweetId: Schema.Types.ObjectId;
  likedAt: Date;
}

const likeSchema = new Schema<InterfaceLike>({
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
  likedAt: {
    type: Date,
    default: Date.now,
  },
});

likeSchema.index({ userId: 1, tweetId: 1 });

const Like: Model<InterfaceLike> = model("Like", likeSchema);

export default Like;
