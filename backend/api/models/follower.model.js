import { model, Schema } from 'mongoose';

const followerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followerAt: {
    type: Date,
    default: Date.now,
  },
});

const Follower = model('Follower', followerSchema);

export default Follower;
