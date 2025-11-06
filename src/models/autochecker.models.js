import mongoose, { Schema } from "mongoose";

const autochecker = new Schema(
  {
    age: { type: Number, required: true },
    symptom: { type: String, required: true, trim: true },
    durationOfSymptom: { type: String, trim: true }, // e.g. "3 days"
    travelHistory: { type: Boolean, default: false },
    medicalHistory: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    suggestion: { type: String, trim: true },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const autocheckerModel = mongoose.model("autochecker", autochecker);
export default autocheckerModel;
