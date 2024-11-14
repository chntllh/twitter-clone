import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceMention extends Document {
  tweetId: Schema.Types.ObjectId;
  mentionedUserId: Schema.Types.ObjectId;
}

const mentionSchema = new Schema<InterfaceMention>({
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
    required: true,
    index: true,
  },
  mentionedUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
});

mentionSchema.index({ tweetId: 1, mentionedUserId: 1 });

const Mention: Model<InterfaceMention> = model("Mention", mentionSchema);

export default Mention;
