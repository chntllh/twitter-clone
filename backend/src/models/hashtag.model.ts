import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceHashtag extends Document {
  name: String;
}

const hashtagSchema = new Schema<InterfaceHashtag>({
  name: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
});

hashtagSchema.index({ name: 1 }, { unique: true });

const Hashtag: Model<InterfaceHashtag> = model("Hashtag", hashtagSchema);

export default Hashtag;