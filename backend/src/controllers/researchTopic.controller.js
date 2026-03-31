import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ResearchTopic } from "../models/researchTopic.model.js";

// Create Topic
const createTopic = asyncHandler(async (req, res) => {
    const topic = await ResearchTopic.create(req.body);

    return res.status(201).json(
        new ApiResponse(201, topic, "Topic created")
    );
});

// Get Topics
const getTopics = asyncHandler(async (req, res) => {
    const topics = await ResearchTopic.find();

    return res.status(200).json(
        new ApiResponse(200, topics, "Topics fetched")
    );
});

// Update Topic
const updateTopic = asyncHandler(async (req, res) => {
    const topic = await ResearchTopic.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, topic, "Topic updated")
    );
});

// Delete Topic
const deleteTopic = asyncHandler(async (req, res) => {
    await ResearchTopic.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Topic deleted")
    );
});

export { createTopic, getTopics, updateTopic, deleteTopic };