import { Router } from "express";
import {
    createNote,
    getNotes,
    updateNote,
    deleteNote
} from "../controllers/note.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
    .post(verifyJWT, createNote);

router.route("/:paperId")
    .get(verifyJWT, getNotes);

router.route("/update/:id")
    .patch(verifyJWT, updateNote);

router.route("/delete/:id")
    .delete(verifyJWT, deleteNote);

export default router;