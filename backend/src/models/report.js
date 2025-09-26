import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  feedback: { type: String, required: true },
  summary: { type: String, required: true },
  sentiment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Report", reportSchema);
