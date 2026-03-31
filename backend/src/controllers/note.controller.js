import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Note } from "../models/note.model.js";

// Create Note
const createNote = asyncHandler(async (req, res) => {
    const note = await Note.create(req.body);

    return res.status(201).json(
        new ApiResponse(201, note, "Note added")
    );
});

// Get Notes by Paper
const getNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({ paper: req.params.paperId });

    return res.status(200).json(
        new ApiResponse(200, notes, "Notes fetched")
    );
});

// Update Note
const updateNote = asyncHandler(async (req, res) => {
    const note = await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, note, "Note updated")
    );
});

// Delete Note
const deleteNote = asyncHandler(async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Note deleted")
    );
});

export { createNote, getNotes, updateNote, deleteNote };