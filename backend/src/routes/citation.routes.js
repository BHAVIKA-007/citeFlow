import { Router } from "express";
import { generateCitation, getCitations } from "../controllers/citation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:paperId")
    .post(verifyJWT, generateCitation)
    .get(verifyJWT, getCitations);

export default router;