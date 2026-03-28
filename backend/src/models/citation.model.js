import mongoose, { Schema } from "mongoose";

const citationSchema = new Schema({
  citationStyle: {
    type: String, // APA, MLA, IEEE
  },
  citationText: {
    type: String,
  },
  paper: {
    type: Schema.Types.ObjectId,
    ref: "Paper",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Citation = mongoose.model("Citation", citationSchema);