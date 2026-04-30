import express from "express";
import {
  createReply,
  createReview,
  deleteReview,
  getReviews,
  toggleDislike,
  toggleLike,
  updateReview,
} from "./review.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/:movieId", getReviews);

router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

router.post("/:id/like", authMiddleware, toggleLike);
router.post("/:id/dislike", authMiddleware, toggleDislike);

router.post("/reply", authMiddleware, createReply);
export default router;
