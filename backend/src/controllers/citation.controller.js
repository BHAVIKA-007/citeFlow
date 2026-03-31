import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Paper } from "../models/paper.model.js";
import { Citation } from "../models/citation.model.js";

const generateAPA = (paper) => {
    return `${paper.authors} (${paper.publicationYear}). ${paper.title}. ${paper.journal}.`;
};

const generateIEEE = (paper) => {
    return `${paper.authors}, "${paper.title}," ${paper.journal}, ${paper.publicationYear}.`;
};

const generateMLA = (paper) => {
    return `${paper.authors}. "${paper.title}." ${paper.journal}, ${paper.publicationYear}.`;
};

// Generate Citation
const generateCitation = asyncHandler(async (req, res) => {
    const paper = await Paper.findById(req.params.paperId);

    let citationText = "";
    const { style } = req.body;

    if (style === "APA") citationText = generateAPA(paper);
    if (style === "IEEE") citationText = generateIEEE(paper);
    if (style === "MLA") citationText = generateMLA(paper);

    const citation = await Citation.create({
        citationStyle: style,
        citationText,
        paper: paper._id
    });

    return res.status(200).json(
        new ApiResponse(200, citation, "Citation generated")
    );
});

// Get Citations
const getCitations = asyncHandler(async (req, res) => {
    const citations = await Citation.find({ paper: req.params.paperId });

    return res.status(200).json(
        new ApiResponse(200, citations, "Citations fetched")
    );
});

export { generateCitation, getCitations };