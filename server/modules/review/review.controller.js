import {
  fetchReviewService,
  createReviewService,
  updateReviewService,
  deleteReviewService,
  toggleLikeService,
  toggleDislikeService,
  createReplyService,
} from "./review.service.js";

import { validateCreateReview, validateReply } from "./review.validation.js";

// 🔹 GET REVIEWS
export async function getReviews(req, res) {
  try {
    const { movieId } = req.params;

    const reviews = await fetchReviewService(movieId);

    res.json(reviews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// 🔹 CREATE REVIEW
export async function createReview(req, res) {
  try {
    validateCreateReview(req.body);

    const result = await createReviewService(req.body, req.user.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// 🔹 UPDATE REVIEW
export async function updateReview(req, res) {
  try {
    const { id } = req.params;

    const result = await updateReviewService(id, req.body, req.user.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// 🔹 DELETE REVIEW
export async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    await deleteReviewService(id, req.user.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// 🔹 LIKE
export async function toggleLike(req, res) {
  try {
    const { id } = req.params;

    const result = await toggleLikeService(id, req.user.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// 🔹 DISLIKE
export async function toggleDislike(req, res) {
  try {
    const { id } = req.params;

    const result = await toggleDislikeService(id, req.user.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// 🔹 REPLY
export async function createReply(req, res) {
  try {
    validateReply(req.body);

    const result = await createReplyService(req.body, req.user.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
