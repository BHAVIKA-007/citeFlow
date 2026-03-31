import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authors: String,
    publicationYear: Number,
    journal: String,
    pdfPath: String,

    readStatus: {
        type: String,
        enum: ["to-read", "in-progress", "completed"],
        default: "to-read"
    },

    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ResearchTopic"
    },

    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tag"
        }
    ],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    isFavorite: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export const Paper = mongoose.model("Paper", paperSchema);