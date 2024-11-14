import { Document, Model, model, Schema } from "mongoose";

export interface InterfaceNotification extends Document {
  userId: Schema.Types.ObjectId;
  actorId: Schema.Types.ObjectId;
  tweetId: Schema.Types.ObjectId;
  notificationType: String;
  createdAt: Date;
}

const notificationSchema = new Schema<InterfaceNotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  actorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
    index: true,
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

notificationSchema.index({ userId: 1, createdAt: -1 });

notificationSchema.index({ actorId: 1, tweetId: 1 });

const Notification: Model<InterfaceNotification> = model(
  "Notification",
  notificationSchema
);

export default Notification;
