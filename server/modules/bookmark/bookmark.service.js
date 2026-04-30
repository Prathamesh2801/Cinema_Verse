import Bookmark from "./bookmark.model.js";

// 🔹 Toggle bookmark
export async function toggleBookmarkService(data, userId) {
  const { movieId } = data;

  const existing = await Bookmark.findOne({
    userId,
    movieId,
  });

  if (existing) {
    await existing.deleteOne();
    return { bookmarked: false };
  }

  await Bookmark.create({
    userId,
    movieId,
  });

  return { bookmarked: true };
}


// 🔹 Get all bookmarks for user
export async function getUserBookmarksService(userId) {
  const bookmarks = await Bookmark.find({ userId });

  return bookmarks;
}


// 🔹 Check if a movie is bookmarked (useful for UI)
export async function isBookmarkedService(userId, movieId) {
  const bookmark = await Bookmark.findOne({
    userId,
    movieId,
  });

  return !!bookmark;
}