import { model, Schema } from 'mongoose';

const mentionSchema = new Schema({
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: 'Tweet',
    required: true,
  },
  mentionedUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Mention = model('Mention', mentionSchema);

export default Mention;
