import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    noteType: {
      type: String,
      enum: ["text", "image", "pdf"],
      default: "text",
    },
    pageNumber: {
      type: Number,
    },
    attachment: {
      type: String, // URL for image/pdf
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