import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Paper } from "../models/paper.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create Paper
const createPaper = asyncHandler(async (req, res) => {
    const {
        title,
        authors,
        publicationYear,
        journal,
        topic,
        tags,
        readStatus
    } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    const paper = await Paper.create({
        title,
        authors,
        publicationYear,
        journal,
        topic,
        tags,
        readStatus,
        owner: req.user._id   // VERY IMPORTANT
    });

    return res.status(201).json(
        new ApiResponse(201, paper, "Paper created")
    );
});

// Get All Papers
const getAllPapers = asyncHandler(async (req, res) => {
    const papers = await Paper.find();

    return res.status(200).json(
        new ApiResponse(200, papers, "All papers fetched")
    );
});

// Get Paper By ID
const getPaperById = asyncHandler(async (req, res) => {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
        throw new ApiError(404, "Paper not found");
    }

    return res.status(200).json(
        new ApiResponse(200, paper, "Paper fetched")
    );
});

// Update Paper
const updatePaper = asyncHandler(async (req, res) => {
    const paper = await Paper.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, paper, "Paper updated")
    );
});

// Delete Paper
const deletePaper = asyncHandler(async (req, res) => {
    await Paper.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Paper deleted")
    );
});

// Upload PDF
const uploadPaperPDF = asyncHandler(async (req, res) => {
    const pdfLocalPath = req.file?.path;

    if (!pdfLocalPath) {
        throw new ApiError(400, "PDF required");
    }

    const pdf = await uploadOnCloudinary(pdfLocalPath);

    const paper = await Paper.findByIdAndUpdate(
        req.params.id,
        { pdfPath: pdf.url },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, paper, "PDF uploaded")
    );
});

const searchPapers = asyncHandler(async (req, res) => {
    const { search, topic, tag, year, sort, favorite } = req.query;

    let query = { owner: req.user._id };

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    if (topic) {
        query.topic = topic;
    }

    if (year) {
        query.publicationYear = year;
    }

    if (tag) {
        query.tags = tag;
    }

    if (favorite === "true") {
        query.isFavorite = true;
    }

    let papersQuery = Paper.find(query)
        .populate("topic", "topicName")
        .populate("tags", "tagName");

    if (sort === "year") {
        papersQuery = papersQuery.sort({ publicationYear: -1 });
    }
    if (sort === "title") {
        papersQuery = papersQuery.sort({ title: 1 });
    }
    if (sort === "created") {
        papersQuery = papersQuery.sort({ createdAt: -1 });
    }

    const papers = await papersQuery;

    return res.status(200).json(
        new ApiResponse(200, papers, "Papers fetched")
    );
});

const toggleFavorite = asyncHandler(async (req, res) => {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
        throw new ApiError(404, "Paper not found");
    }

    paper.isFavorite = !paper.isFavorite;
    await paper.save();

    return res.status(200).json(
        new ApiResponse(200, paper, "Favorite toggled")
    );
});

const getPapersByTopic = asyncHandler(async (req, res) => {
    const papers = await Paper.find({
        topic: req.params.topicId,
        owner: req.user._id
    })
    .populate("topic", "topicName")
    .populate("tags", "tagName");

    return res.status(200).json(
        new ApiResponse(200, papers, "Papers for topic fetched")
    );
});



// IMPORTANT EXPORT
export {
    createPaper,
    getAllPapers,
    getPaperById,
    updatePaper,
    deletePaper,
    uploadPaperPDF,
    searchPapers,
    getPapersByTopic,
    toggleFavorite
};