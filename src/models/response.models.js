import mongoose, { Schema } from "mongoose";

const response = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    chatId: mongoose.Schema.Types.ObjectId,
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const responseModel = mongoose.model("response", response);
export default responseModel;
