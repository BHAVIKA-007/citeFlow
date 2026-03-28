import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  changePassword
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Register
router.route("/register").post(
  upload.single("avatar"),
  registerUser
);

// Login
router.route("/login").post(loginUser);

// Logout
router.route("/logout").post(verifyJWT, logoutUser);

// Refresh token
router.route("/refresh-token").post(refreshAccessToken);

// Get current user
router.route("/me").get(verifyJWT, getCurrentUser);

// Update profile
router.route("/update-profile").patch(verifyJWT, updateAccountDetails);

// Update avatar
router.route("/avatar").patch(
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);

// Change password
router.route("/change-password").post(
  verifyJWT,
  changePassword
);

export default router;