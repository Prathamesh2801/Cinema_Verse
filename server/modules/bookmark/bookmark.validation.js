const STATUSES = ["want", "watching", "watched"];

export function validateToggleBookmark(data) {
  const { mediaId } = data;

  if (!mediaId) {
    throw new Error("mediaId is required");
  }
}

export function validateUpsertEntry(data) {
  const { mediaId, mediaType, status, rating } = data;

  if (!mediaId) {
    throw new Error("mediaId is required");
  }

  if (!mediaType || !["movie", "tv"].includes(mediaType)) {
    throw new Error("mediaType must be 'movie' or 'tv'");
  }

  if (status !== undefined && !STATUSES.includes(status)) {
    throw new Error("Invalid status");
  }

  if (rating !== undefined && (rating < 0 || rating > 5)) {
    throw new Error("Rating must be between 0 and 5");
  }
}
