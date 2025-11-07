import mongoose, { Schema } from "mongoose";

const checkReport = new Schema(
  {
    /*
     * To include other fields later
     */
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const checkReportModel = mongoose.model("checkReports", checkReport);
export default checkReportModel;
