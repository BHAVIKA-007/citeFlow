import mongoose, { Schema } from "mongoose";

const researchTopicSchema = new Schema(
  {
    topicName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    domain: {
      type: String,
    },
    topicType: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default: "active",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const ResearchTopic = mongoose.model(
  "ResearchTopic",
  researchTopicSchema
);