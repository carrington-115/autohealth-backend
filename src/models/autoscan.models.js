import mongoose, { Schema } from "mongoose";

const autoscan = new Schema(
  {
    imgUrl: {
      // This will be from the google cloud bucket
      type: String,
      required: true,
    },
    medication_name: {
      type: String,
      required: true,
    },
    symptom: {
      type: String,
      required: true,
    },
    duration_of_symptom: {
      // this should be in hours
      type: Number,
      required: true,
    },
    suggestion: {
      type: Boolean,
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const autoscanModel = mongoose.model("autoscan", autoscan);

export default autoscanModel;
