import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    noteType: {
      type: String,
    },
    pageNumber: {
      type: Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    paper: {
      type: Schema.Types.ObjectId,
      ref: "Paper",
    },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model("Note", noteSchema);