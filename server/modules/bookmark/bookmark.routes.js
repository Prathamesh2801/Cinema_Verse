import express from "express";
import {
  toggleBookmark,
  getUserBookmarks,
  isBookmarked,
} from "./bookmark.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/toggle", authMiddleware, toggleBookmark);

router.get("/", authMiddleware, getUserBookmarks);

router.get("/:mediaId", authMiddleware, isBookmarked);

export default router;
