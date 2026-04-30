export function validateCreateReview(data) {
  const { movieId, rating, review } = data;

  if (!movieId) {
    throw new Error("movieId is required");
  }

  if (!rating || rating < 1 || rating > 10) {
    throw new Error("Rating must be between 1 and 10");
  }

  if (!review || review.length < 3) {
    throw new Error("Review must be at least 3 characters");
  }
}

export function validateReply(data) {
  const { movieId, review, parentId } = data;

  if (!movieId) throw new Error("movieId required");
  if (!parentId) throw new Error("parentId required");
  if (!review) throw new Error("Reply cannot be empty");
}
