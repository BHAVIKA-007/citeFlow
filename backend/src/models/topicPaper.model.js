import mongoose, { Schema } from "mongoose";

const topicPaperSchema = new Schema({
  topic: {
    type: Schema.Types.ObjectId,
    ref: "ResearchTopic",
  },
  paper: {
    type: Schema.Types.ObjectId,
    ref: "Paper",
  },
});

export const TopicPaper = mongoose.model("TopicPaper", topicPaperSchema);