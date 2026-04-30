export function validateToggleBookmark(data) {
  const { movieId } = data;

  if (!movieId) {
    throw new Error("movieId is required");
  }
}