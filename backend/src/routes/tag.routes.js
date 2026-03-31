import { Router } from "express";
import { createTag, getTags, deleteTag } from "../controllers/tag.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
    .post(verifyJWT, createTag)
    .get(verifyJWT, getTags);

router.route("/:id")
    .delete(verifyJWT, deleteTag);

export default router;