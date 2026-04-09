import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Highlight } from "../models/highlight.model.js";

// Add Highlight
const addHighlight = asyncHandler(async (req, res) => {
    const highlightData = {
        ...req.body,
        owner: req.user._id
    };

    const highlight = await Highlight.create(highlightData);

    return res.status(201).json(
        new ApiResponse(201, highlight, "Highlight added")
    );
});

// Get Highlights
const getHighlights = asyncHandler(async (req, res) => {
    const highlights = await Highlight.find({ paper: req.params.paperId, owner: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, highlights, "Highlights fetched")
    );
});

// Delete Highlight
const deleteHighlight = asyncHandler(async (req, res) => {
    const highlight = await Highlight.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!highlight) {
        throw new ApiError(404, "Highlight not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Highlight deleted")
    );
});

export { addHighlight, getHighlights, deleteHighlight };