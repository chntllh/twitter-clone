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
  },
  actorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tweetId: {
    type: Schema.Types.ObjectId,
    ref: "Tweet",
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

const Notification: Model<InterfaceNotification> = model(
  "Notification",
  notificationSchema
);

export default Notification;
