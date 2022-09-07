import express from "express";
const router = express.Router();
import {
  getUserProfile,
  login,
  signUp,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", signUp);
router.post("/login", login);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
