import {
  toggleBookmarkService,
  upsertEntryService,
  removeEntryService,
  getUserBookmarksService,
  isBookmarkedService,
} from "./bookmark.service.js";

import {
  validateToggleBookmark,
  validateUpsertEntry,
} from "./bookmark.validation.js";

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

// 🔹 Upsert a library entry (status / rating / note)
export async function updateEntry(req, res) {
  try {
    validateUpsertEntry(req.body);
    const result = await upsertEntryService(req.user.id, req.body);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// 🔹 Remove a library entry entirely
export async function removeEntry(req, res) {
  try {
    const { mediaId } = req.params;
    const { mediaType } = req.query;

    const result = await removeEntryService(req.user.id, mediaId, mediaType);

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
