import { Router } from "express";
import {
    createPaper,
    getAllPapers,
    getPaperById,
    updatePaper,
    deletePaper,
    uploadPaperPDF,
    searchPapers,
    toggleFavorite,
    getPapersByTopic
} from "../controllers/paper.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// IMPORTANT — custom routes first
router.route("/search").get(verifyJWT, searchPapers);
router.route("/favorite/:id").patch(verifyJWT, toggleFavorite);
router.route("/topic/:topicId").get(verifyJWT, getPapersByTopic);

// normal routes
router.route("/")
    .post(verifyJWT, upload.single("pdf"), createPaper)
    .get(verifyJWT, getAllPapers);

router.route("/:id")
    .get(verifyJWT, getPaperById)
    .patch(verifyJWT, updatePaper)
    .delete(verifyJWT, deletePaper);

router.route("/:id/pdf")
    .post(verifyJWT, upload.single("pdf"), uploadPaperPDF);

export default router;