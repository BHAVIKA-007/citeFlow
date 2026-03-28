import mongoose, { Schema } from "mongoose";

const highlightSchema = new Schema({
  highlightedText: {
    type: String,
  },
  pageNumber: {
    type: Number,
  },
  comment: {
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

export const Highlight = mongoose.model("Highlight", highlightSchema);