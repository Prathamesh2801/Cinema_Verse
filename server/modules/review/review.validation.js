import { createError } from "./review.helper.js";

export function validateCreateReview(data) {
  const { mediaId, rating, review } = data;

  if (!mediaId || typeof mediaId !== "number") {
    const err = new Error("mediaId must be a number");
    err.status = 400;
    throw err;
  }

  if (typeof rating !== "number" || rating < 1 || rating > 10) {
    const err = new Error("Rating must be between 1 and 10");
    err.status = 400;
    throw err;
  }

  if (!review || review.trim().length < 3) {
    const err = new Error("Review must be at least 3 characters");
    err.status = 400;
    throw err;
  }
}

export function validateUpdateReview(data) {
  const { rating, review } = data;

  if (rating !== undefined && (rating < 1 || rating > 10)) {
    const err = new Error("Rating must be between 1 and 10");
    err.status = 400;
    throw err;
  }

  if (review !== undefined && review.trim().length < 3) {
    const err = new Error("Review must be at least 3 characters");
    err.status = 400;
    throw err;
  }
}

export function validateReply(data) {
  const { review, parentId } = data;

  if (!parentId) throw createError("parentId required");
  if (!review || review.trim().length < 1)
    throw createError("Reply cannot be empty");
}
