import {
  toggleBookmarkService,
  getUserBookmarksService,
  isBookmarkedService,
} from "./bookmark.service.js";

import { validateToggleBookmark } from "./bookmark.validation.js";

// 🔹 Toggle Bookmark
export async function toggleBookmark(req, res) {
  try {
    validateToggleBookmark(req.body);
    const userId = req.user.id;
    const result = await toggleBookmarkService(userId, req.body);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// 🔹 Get all bookmarks of logged-in user
export async function getUserBookmarks(req, res) {
  try {
    const result = await getUserBookmarksService(req.user.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// 🔹 Check single movie bookmark
export async function isBookmarked(req, res) {
  try {
    const { mediaId } = req.params;

    const result = await isBookmarkedService(req.user.id, mediaId);

    res.json({ isBookmarked: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
