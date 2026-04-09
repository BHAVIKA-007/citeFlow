import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Note } from "../models/note.model.js";

// Create Note
const createNote = asyncHandler(async (req, res) => {
    const noteData = {
        ...req.body,
        owner: req.user._id
    };

    const note = await Note.create(noteData);

    return res.status(201).json(
        new ApiResponse(201, note, "Note added")
    );
});

// Get Notes by Paper
const getNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({ paper: req.params.paperId, owner: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, notes, "Notes fetched")
    );
});

// Update Note
const updateNote = asyncHandler(async (req, res) => {
    const note = await Note.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        req.body,
        { returnDocument: "after" }
    );

    if (!note) {
        throw new ApiError(404, "Note not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, note, "Note updated")
    );
});

// Delete Note
const deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!note) {
        throw new ApiError(404, "Note not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Note deleted")
    );
});

export { createNote, getNotes, updateNote, deleteNote };