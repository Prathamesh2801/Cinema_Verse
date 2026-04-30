export function validateToggleBookmark(data) {
  const { mediaId } = data;

  if (!mediaId) {
    throw new Error("mediaId is required");
  }
}
