import mongoose, { Schema } from "mongoose";

const messages = new Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    response: {}, // to be completed,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("messages", messages);
export default messageModel;
