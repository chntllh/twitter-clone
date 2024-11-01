import { model, Schema } from 'mongoose';

const hashtagSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

const Hashtag = model('Hashtag', hashtagSchema);

export default Hashtag;
