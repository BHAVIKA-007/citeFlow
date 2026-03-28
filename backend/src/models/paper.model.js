import mongoose, { Schema } from "mongoose";

const paperSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: String,
    },
    publicationYear: {
      type: Number,
    },
    journal: {
      type: String,
    },
    publisher: {
      type: String,
    },
    paperType: {
      type: String,
    },
    doi: {
      type: String,
    },
    paperUrl: {
      type: String,
    },
    pdfPath: {
      type: String,
    },
    abstract: {
      type: String,
    },
    keywords: {
      type: String,
    },
    relevanceRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    readStatus: {
      type: String,
      enum: ["to-read", "reading", "completed"],
      default: "to-read",
    },
  },
  {
    timestamps: true,
  }
);

export const Paper = mongoose.model("Paper", paperSchema);