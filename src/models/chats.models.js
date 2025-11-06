import mongoose, { Schema } from "mongoose";

const chats = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("chats", chats);

export default chatModel;
