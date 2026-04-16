import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Paper } from "../models/paper.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// Create Paper

const createPaper = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        authors,
        publicationYear,
        journal,
        topics,
        tags,
        readStatus,
        externalLink
    } = req.body;

    console.log("🟡 CREATE PAPER BODY:", req.body);
    console.log("📄 FILE RECEIVED:", req.file);

    if (!title || !title.trim()) {
        throw new ApiError(400, "Title is required");
    }

  

let yearNumber;

if (publicationYear !== undefined && publicationYear !== "") {
    yearNumber = Number(publicationYear);

    if (!Number.isInteger(yearNumber)) {
        throw new ApiError(400, "Publication year must be a number");
    }

    if (yearNumber < 1000 || yearNumber > new Date().getFullYear() + 10) {
        throw new ApiError(400, "Publication year is out of valid range");
    }
}

    // ================= AUTHORS =================
    let authorsArray = [];
    if (typeof authors === 'string') {
        authorsArray = authors.split(',').map(a => a.trim()).filter(a => a);
    } else if (Array.isArray(authors)) {
        authorsArray = authors.filter(a => a);
    }

    console.log("👤 AUTHORS ARRAY:", authorsArray);

    // ================= TOPICS =================
    let topicsArray = [];

    if (Array.isArray(topics)) {
        topicsArray = topics.filter(t => t);
    } else if (typeof topics === 'string' && topics.trim()) {
        topicsArray = [topics];
    }

    console.log("🏷 TOPICS ARRAY:", topicsArray);

    // ================= PDF UPLOAD =================
    let pdfUrl = "";

    if (req.file) {
        console.log("📤 Uploading PDF to Cloudinary...");

        const pdf = await uploadOnCloudinary(req.file.path, {
            resource_type: "raw",
            type: "upload",
            flags: "attachment"
        });

        if (!pdf) {
            throw new ApiError(500, "PDF upload failed");
        }

        pdfUrl = pdf.secure_url;
        console.log("✅ PDF UPLOADED:", pdfUrl);
    } else {
        console.log("⚠️ No PDF uploaded");
    }

    // ================= CREATE =================
    const paper = await Paper.create({
        title: title.trim(),
        description: description || "",
        authors: authorsArray,
        publicationYear:yearNumber,
        journal: journal || "",
        externalLink: externalLink || "",   // ✅ optional
        pdfPath: pdfUrl,                    // ✅ optional
        topics: topicsArray,                // ✅ 0 / 1 / multiple
        tags: tags || [],
        readStatus: readStatus || "to-read",
        owner: req.user._id
    });

    console.log("🎉 PAPER CREATED:", paper);

    const populatedPaper = await paper.populate([
        { path: "topics", select: "topicName" },
        { path: "tags", select: "tagName" }
    ]);

    return res.status(201).json(
        new ApiResponse(201, populatedPaper, "Paper created successfully")
    );
});

// Get All Papers
const getAllPapers = asyncHandler(async (req, res) => {
    const papers = await Paper.find({ owner: req.user._id })
        .populate("topics", "topicName")
        .populate("tags", "tagName")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, papers, "All papers fetched")
    );
});

// Get Paper By ID
const getPaperById = asyncHandler(async (req, res) => {
    console.log("PARAM ID:", req.params.id);
    console.log("USER ID:", req.user._id);

    const paper = await Paper.findById(req.params.id)
        .populate("topics", "topicName")
        .populate("tags", "tagName");

    console.log("FOUND PAPER:", paper);

    if (!paper) {
        throw new ApiError(404, "Paper not found");
    }

    return res.status(200).json(
        new ApiResponse(200, paper, "Paper fetched")
    );
});

// Update Paper
const updatePaper = asyncHandler(async (req, res) => {
    const { authors, topics } = req.body;
    
    let updateData = { ...req.body };

    // Handle authors as array
    if (authors && typeof authors === 'string') {
        updateData.authors = authors.split(',').map(a => a.trim()).filter(a => a);
    }

    // Handle topics as array
    if (topics) {
        if (typeof topics === 'string') {
            updateData.topics = [topics];
        } else if (Array.isArray(topics)) {
            updateData.topics = topics.filter(t => t);
        }
    }

    const paper = await Paper.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        updateData,
        { returnDocument: "after", runValidators: true }
    ).populate("topics", "topicName").populate("tags", "tagName");

    if (!paper) {
        throw new ApiError(404, "Paper not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, paper, "Paper updated successfully")
    );
});

// Delete Paper
const deletePaper = asyncHandler(async (req, res) => {
    const paper = await Paper.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!paper) {
        throw new ApiError(404, "Paper not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Paper deleted")
    );
});

// Upload PDF
const uploadPaperPDF = asyncHandler(async (req, res) => {
    console.log("REQ.FILE:", req.file);

    const pdfLocalPath = req.file?.path;

    if (!pdfLocalPath) {
        throw new ApiError(400, "PDF required");
    }

    const pdf = await uploadOnCloudinary(pdfLocalPath, {
        resource_type: "raw",
        type: "upload",        // 🔥 IMPORTANT
    flags: "attachment"  
    });

    if (!pdf) {
        throw new ApiError(500, "Cloudinary upload failed");
    }

    console.log("CLOUDINARY RESPONSE:", pdf);

    const paper = await Paper.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { pdfPath: pdf.secure_url },
        { returnDocument: "after" }
    );

    if (!paper) {
        throw new ApiError(404, "Paper not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, paper, "PDF uploaded")
    );
});

    

const searchPapers = asyncHandler(async (req, res) => {
    const { search, topic, tag, year, sort, favorite, searchBy } = req.query;

    let query = { owner: req.user._id };

    if (search) {
        const searchRegex = { $regex: search, $options: "i" };
        
        if (searchBy === 'author') {
            query.authors = searchRegex;
        } else if (searchBy === 'title') {
            query.$or = [
                { title: searchRegex },
                { description: searchRegex }
            ];
        } else {
            // Default: search title, description, and authors
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { authors: searchRegex }
            ];
        }
    }

    if (topic) {
        query.topics = topic;
    }

    if (year) {
        query.publicationYear = parseInt(year);
    }

    if (tag) {
        query.tags = tag;
    }

    if (favorite === "true") {
        query.isFavorite = true;
    }

    let papersQuery = Paper.find(query)
        .populate("topics", "topicName")
        .populate("tags", "tagName");

    if (sort === "year-asc") {
        papersQuery = papersQuery.sort({ publicationYear: 1 });
    } else if (sort === "year-desc") {
        papersQuery = papersQuery.sort({ publicationYear: -1 });
    } else if (sort === "title") {
        papersQuery = papersQuery.sort({ title: 1 });
    } else {
        papersQuery = papersQuery.sort({ createdAt: -1 });
    }

    const papers = await papersQuery;

    return res.status(200).json(
        new ApiResponse(200, papers, "Papers fetched successfully")
    );
});

const toggleFavorite = asyncHandler(async (req, res) => {
    const paper = await Paper.findOne({ _id: req.params.id, owner: req.user._id });

    if (!paper) {
        throw new ApiError(404, "Paper not found or unauthorized");
    }

    paper.isFavorite = !paper.isFavorite;
    await paper.save();

    return res.status(200).json(
        new ApiResponse(200, paper, "Favorite toggled")
    );
});

const getPapersByTopic = asyncHandler(async (req, res) => {
    const papers = await Paper.find({
        topics: req.params.topicId,
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