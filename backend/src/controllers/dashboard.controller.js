import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Paper } from "../models/paper.model.js";
import { ResearchTopic } from "../models/researchTopic.model.js";
import { Note } from "../models/note.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {
    const totalPapers = await Paper.countDocuments({ owner: req.user._id });
    const totalTopics = await ResearchTopic.countDocuments({ owner: req.user._id });
    const totalNotes = await Note.countDocuments({ owner: req.user._id });
    const favoritePapers = await Paper.countDocuments({
        owner: req.user._id,
        isFavorite: true
    });

    return res.status(200).json(
        new ApiResponse(200, {
            totalPapers,
            totalTopics,
            totalNotes,
            favoritePapers
        }, "Dashboard stats")
    );
});

export { getDashboardStats };