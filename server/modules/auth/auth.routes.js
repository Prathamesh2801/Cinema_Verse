import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
} from "./auth.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { singleImage } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.post("/avatar", authMiddleware, singleImage("avatar"), updateAvatar);
router.delete("/avatar", authMiddleware, removeAvatar);
router.put("/password", authMiddleware, changePassword);

export default router;
