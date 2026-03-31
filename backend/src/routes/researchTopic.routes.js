import { Router } from "express";
import {
    createTopic,
    getTopics,
    updateTopic,
    deleteTopic
} from "../controllers/researchTopic.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
    .post(verifyJWT, createTopic)
    .get(verifyJWT, getTopics);

router.route("/:id")
    .patch(verifyJWT, updateTopic)
    .delete(verifyJWT, deleteTopic);

export default router;