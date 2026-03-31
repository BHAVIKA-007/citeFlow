import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tag } from "../models/tag.model.js";

// Create Tag
const createTag = asyncHandler(async (req, res) => {
    const { tagName } = req.body;

    if (!tagName) {
        throw new ApiError(400, "Tag name required");
    }

    const tag = await Tag.create({ tagName });

    return res.status(201).json(
        new ApiResponse(201, tag, "Tag created")
    );
});

// Get All Tags
const getTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find();

    return res.status(200).json(
        new ApiResponse(200, tags, "Tags fetched")
    );
});

// Delete Tag
const deleteTag = asyncHandler(async (req, res) => {
    await Tag.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Tag deleted")
    );
});

export { createTag, getTags, deleteTag };