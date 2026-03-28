import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema({
  tagName: {
    type: String,
    required: true,
  },
});

export const Tag = mongoose.model("Tag", tagSchema);