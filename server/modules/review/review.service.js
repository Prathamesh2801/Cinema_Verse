import Review from "./review.model.js";

export async function fetchReviewService(movieId) {
  const reviews = await Review.find({ movieId }).populate("userId", "username");

  return reviews;
}

export async function createReviewService(data, userId) {
  const { movieId, rating, review } = data;

  return await Review.create({
    userId,
    movieId,
    rating,
    review,
  });
}

export async function updateReviewService(id, data, userId) {
  const existing = await Review.findById(id);

  if (!existing) throw new Error("Review not found");

  if (existing.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  existing.rating = data.rating;
  existing.review = data.review;

  await existing.save();

  return existing;
}

export async function deleteReviewService(id, userId) {
  const existing = await Review.findById(id);

  if (!existing) throw new Error("Not found");

  if (existing.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  await existing.deleteOne();
}

export async function toggleLikeService(id, userId) {
  const review = await Review.findById(id);

  if (review.userId.toString() === userId) {
    throw new Error("Cannot like own review");
  }

  const liked = review.likes.includes(userId);

  if (liked) {
    review.likes.pull(userId);
  } else {
    review.likes.push(userId);
    review.dislikes.pull(userId);
  }

  await review.save();

  return review;
}

export async function toggleDislikeService(id, userId) {
  const review = await Review.findById(id);

  if (!review) throw new Error("Review not found");

  if (review.userId.toString() === userId) {
    throw new Error("Cannot dislike own review");
  }

  const disliked = review.dislikes.includes(userId);

  if (disliked) {
    review.dislikes.pull(userId);
  } else {
    review.dislikes.push(userId);
    review.likes.pull(userId);
  }

  await review.save();

  return review;
}

export async function createReplyService(data, userId) {
  const { movieId, review, parentId } = data;

  const parent = await Review.findById(parentId);

  if (!parent) throw new Error("Invalid parentId");

  if (parent.movieId !== movieId) {
    throw new Error("Parent review mismatch");
  }

  return await Review.create({
    userId,
    movieId,
    review,
    parentId,
  });
}
