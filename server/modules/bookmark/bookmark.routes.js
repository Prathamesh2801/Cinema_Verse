import express from "express";
import {
  toggleBookmark,
  updateEntry,
  removeEntry,
  getUserBookmarks,
  isBookmarked,
} from "./bookmark.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/toggle", authMiddleware, toggleBookmark);

router.get("/", authMiddleware, getUserBookmarks);
router.put("/", authMiddleware, updateEntry);

router.delete("/:mediaId", authMiddleware, removeEntry);
router.get("/:mediaId", authMiddleware, isBookmarked);

export default router;
