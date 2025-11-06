import mongoose, { Schema } from "mongoose";

const autoscanReports = new Schema(
  {
    // complete after
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const autoscanReportModel = mongoose.model("autoscanReports", autoscanReports);
export default autoscanReportModel;
