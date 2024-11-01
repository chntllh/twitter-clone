import { model, Schema } from 'mongoose';

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  actorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: 'Tweet',
  },
  notificationType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = model('Notification', notificationSchema);

export default Notification;
