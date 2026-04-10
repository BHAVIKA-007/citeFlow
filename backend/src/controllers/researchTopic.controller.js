import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ResearchTopic } from "../models/researchTopic.model.js";
import { Paper } from "../models/paper.model.js";

// Create Topic
const createTopic = asyncHandler(async (req, res) => {
    const topicData = {
        topicName: req.body.topicName || req.body.name,
        description: req.body.description,
        domain: req.body.domain,
        topicType: req.body.topicType,
        priority: req.body.priority,
        status: req.body.status,
        owner: req.user._id
    };

    const topic = await ResearchTopic.create(topicData);

    return res.status(201).json(
        new ApiResponse(201, topic, "Topic created")
    );
});

// Get Topics

const getTopics = asyncHandler(async (req, res) => {
    const topics = await ResearchTopic.find({ owner: req.user._id });

    const topicsWithCount = await Promise.all(
        topics.map(async (topic) => {
            const count = await Paper.countDocuments({ topic: topic._id, owner: req.user._id });
            return {
                ...topic.toObject(),
                name: topic.topicName || topic.name || "Untitled Topic",
                paperCount: count
            };
        })
    );

    return res.status(200).json(
        new ApiResponse(200, topicsWithCount, "Topics fetched")
    );
});

// Update Topic
const updateTopic = asyncHandler(async (req, res) => {
    const topic = await ResearchTopic.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: "after" }
    );

    return res.status(200).json(
        new ApiResponse(200, topic, "Topic updated")
    );
});

// Delete Topic
const deleteTopic = asyncHandler(async (req, res) => {
    const { deletePapers } = req.body;

    const topic = await ResearchTopic.findById(req.params.id);
    if (!topic) {
        throw new ApiError(404, "Topic not found");
    }

    if (deletePapers) {
        // Delete associated papers
        await Paper.deleteMany({ topic: req.params.id, owner: req.user._id });
    } else {
        // Unassign papers from topic
        await Paper.updateMany({ topic: req.params.id, owner: req.user._id }, { $unset: { topic: 1 } });
    }

    await ResearchTopic.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Topic deleted")
    );
});

export { createTopic, getTopics, updateTopic, deleteTopic };