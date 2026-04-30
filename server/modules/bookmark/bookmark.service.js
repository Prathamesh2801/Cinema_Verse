import Bookmark from "./bookmark.model.js";

export async function toggleBookmarkService(userId, data) {
  const { mediaId, mediaType } = data;

  const existing = await Bookmark.findOne({
    userId,
    mediaId,
    mediaType,
  });

  if (existing) {
    await existing.deleteOne();
    return { removed: true };
  }

  const bookmark = await Bookmark.create({
    userId,
    mediaId,
    mediaType,
  });

  return { added: true, bookmark };
}

// 🔹 Get all bookmarks for user
export async function getUserBookmarksService(userId) {
  const bookmarks = await Bookmark.find({ userId });

  return bookmarks;
}

// 🔹 Check if a movie is bookmarked (useful for UI)
export async function isBookmarkedService(userId, mediaId) {
  const bookmark = await Bookmark.findOne({
    userId,
    mediaId,
  });

  return !!bookmark;
}
