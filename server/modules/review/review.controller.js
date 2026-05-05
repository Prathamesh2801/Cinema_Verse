import { handleError } from "./review.helper.js";
import {
  fetchReviewService,
  createReviewService,
  updateReviewService,
  deleteReviewService,
  toggleLikeService,
  toggleDislikeService,
  createReplyService,
} from "./review.service.js";

import {
  validateCreateReview,
  validateReply,
  validateUpdateReview,
} from "./review.validation.js";



// GET
export async function getReviews(req, res) {
  try {
    const { id: mediaId } = req.params;
    const userId = req.user?.id || null;

    const reviews = await fetchReviewService(Number(mediaId), userId);

    res.json({ success: true, data: reviews });
  } catch (err) {
    handleError(res, err);
  }
}

// CREATE
export async function createReview(req, res) {
  try {
    const payload = {
      ...req.body,
      mediaId: Number(req.body.mediaId),
    };

    validateCreateReview(payload);

    const result = await createReviewService(payload, req.user.id);

    res.json({ success: true, data: result });
  } catch (err) {
    handleError(res, err);
  }
}

// UPDATE
export async function updateReview(req, res) {
  try {
    validateUpdateReview(req.body);

    const result = await updateReviewService(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({ success: true, data: result });
  } catch (err) {
    handleError(res, err);
  }
}

// DELETE
export async function deleteReview(req, res) {
  try {
    const result = await deleteReviewService(req.params.id, req.user.id);

    res.json({ success: true, data: result });
  } catch (err) {
    handleError(res, err);
  }
}

// LIKE
export async function toggleLike(req, res) {
  try {
    const result = await toggleLikeService(req.params.id, req.user.id);

    res.json({ success: true, data: result });
  } catch (err) {
    handleError(res, err);
  }
}

// DISLIKE
export async function toggleDislike(req, res) {
  try {
    const result = await toggleDislikeService(req.params.id, req.user.id);

    res.json({ success: true, data: result });
  } catch (err) {
    handleError(res, err);
  }
}

// REPLY
export async function createReply(req, res) {
  try {
    validateReply(req.body);

    const result = await createReplyService(req.body, req.user.id);

    res.json({ success: true, data: result });
  } catch (err) {
    handleError(res, err);
  }
}