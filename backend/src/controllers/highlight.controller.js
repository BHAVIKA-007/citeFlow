import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Highlight } from "../models/highlight.model.js";

// Add Highlight
const addHighlight = asyncHandler(async (req, res) => {
    const highlight = await Highlight.create(req.body);

    return res.status(201).json(
        new ApiResponse(201, highlight, "Highlight added")
    );
});

// Get Highlights
const getHighlights = asyncHandler(async (req, res) => {
    const highlights = await Highlight.find({ paper: req.params.paperId });

    return res.status(200).json(
        new ApiResponse(200, highlights, "Highlights fetched")
    );
});

// Delete Highlight
const deleteHighlight = asyncHandler(async (req, res) => {
    await Highlight.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Highlight deleted")
    );
});

export { addHighlight, getHighlights, deleteHighlight };