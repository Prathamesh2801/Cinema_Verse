import Review from "./review.model.js";
import { normalizeReview, createError } from "./review.helper.js";

export async function fetchReviewService(mediaId, userId) {
  const reviews = await Review.find({ mediaId })
    .populate("userId", "username")
    .lean();

  return reviews.map((r) => normalizeReview(r, userId));
}

export async function createReviewService(data, userId) {
  const { mediaId, rating, review } = data;

  const created = await Review.create({
    userId,
    mediaId,
    rating,
    review,
  });

  await created.populate("userId", "username");

  return normalizeReview(created, userId);
}

export async function updateReviewService(id, data, userId) {
  const existing = await Review.findById(id);

  if (!existing) throw createError("Review not found", 404);

  if (existing.userId.toString() !== userId)
    throw createError("Unauthorized", 403);

  if (data.rating !== undefined) existing.rating = data.rating;
  if (data.review !== undefined) existing.review = data.review;

  await existing.save();
  await existing.populate("userId", "username");

  return normalizeReview(existing, userId);
}

export async function deleteReviewService(id, userId) {
  const existing = await Review.findById(id);

  if (!existing) throw createError("Review not found", 404);
  if (existing.userId.toString() !== userId)
    throw createError("Unauthorized", 403);

  await Review.deleteMany({ parentId: id }); // 🔥 cascade
  await existing.deleteOne();

  return { message: "Deleted successfully" };
}

export async function toggleLikeService(id, userId) {
  const review = await Review.findById(id).populate("userId", "username");

  if (!review) throw createError("Review not found", 404);
  if (review.userId._id.toString() === userId)
    throw createError("Cannot like your own review", 400);

  const liked = review.likes.includes(userId);

  if (liked) {
    review.likes.pull(userId);
  } else {
    review.likes.push(userId);
    review.dislikes.pull(userId);
  }

  await review.save();

  return normalizeReview(review, userId);
}

export async function toggleDislikeService(id, userId) {
  const review = await Review.findById(id).populate("userId", "username");

  if (!review) throw createError("Review not found", 404);
  if (review.userId._id.toString() === userId)
    throw createError("Cannot like your own review", 400);

  const disliked = review.dislikes.includes(userId);

  if (disliked) {
    review.dislikes.pull(userId);
  } else {
    review.dislikes.push(userId);
    review.likes.pull(userId);
  }

  await review.save();

  return normalizeReview(review, userId);
}

export async function createReplyService(data, userId) {
  const { review, parentId } = data;

  const parent = await Review.findById(parentId);

  if (!parent) throw createError("Invalid parentId", 400);

  const reply = await Review.create({
    userId,
    mediaId: Number(parent.mediaId),
    review,
    parentId,
  });

  await reply.populate("userId", "username");

  return normalizeReview(reply, userId);
}
