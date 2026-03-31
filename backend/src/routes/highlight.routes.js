import { Router } from "express";
import {
    addHighlight,
    getHighlights,
    deleteHighlight
} from "../controllers/highlight.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
    .post(verifyJWT, addHighlight);

router.route("/:paperId")
    .get(verifyJWT, getHighlights);

router.route("/:id")
    .delete(verifyJWT, deleteHighlight);

export default router;