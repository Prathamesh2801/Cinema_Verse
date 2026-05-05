export function createError(msg) {
  const err = new Error(msg);
  err.status = 400;
  return err;
}


export function handleError(res, err) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
}

export function normalizeReview(r, userId = null) {
  return {
    _id: r._id,
    user: {
      id: r.userId._id,
      username: r.userId.username,
    },
    mediaId: r.mediaId,
    rating: r.rating,
    comment: r.review,
    likes: r.likes.length,
    dislikes: r.dislikes.length,
    isLiked: userId ? r.likes.includes(userId) : false,
    isDisliked: userId ? r.dislikes.includes(userId) : false,
    parentId: r.parentId,
    createdAt: r.createdAt,
  };
}

