import { model, Schema } from 'mongoose';

const retweetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: 'Tweet',
    required: true,
  },
  retweetedAt: {
    type: Date,
    default: Date.now,
  },
});

const Retweet = model('Retweet', retweetSchema);

export default Retweet;
