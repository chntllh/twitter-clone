import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceHashtag extends Document {
  hashtag: String;
}

const hashtagSchema = new Schema<InterfaceHashtag>({
  hashtag: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
});

hashtagSchema.index({ hashtag: 1 }, { unique: true });

const Hashtag: Model<InterfaceHashtag> = model("Hashtag", hashtagSchema);

export default Hashtag;
