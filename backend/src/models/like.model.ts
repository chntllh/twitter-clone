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
  },
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
    required: true,
  },
  likedAt: {
    type: Date,
    default: Date.now,
  },
});

const Like: Model<InterfaceLike> = model("Like", likeSchema);

export default Like;
