import { model, Schema } from 'mongoose';

const likeSchema = new Schema({
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
  likedAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = model('Like', likeSchema)

export default Like;