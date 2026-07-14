import Bookmark from "./bookmark.model.js";

// Old bookmarks (pre-Library) have no `status` — treat them as "want".
function normalizeEntry(entry) {
  return {
    ...entry,
    status: entry.status || "want",
    rating: entry.rating || 0,
    note: entry.note || "",
    watchedAt: entry.watchedAt || null,
  };
}

// 🔹 Quick "want" toggle (heart button)
export async function toggleBookmarkService(userId, data) {
  const { mediaId, mediaType } = data;

  const existing = await Bookmark.findOne({ userId, mediaId, mediaType });

  if (existing) {
    await existing.deleteOne();
    return { removed: true };
  }

  const bookmark = await Bookmark.create({
    userId,
    mediaId,
    mediaType,
    status: "want",
  });

  return { added: true, bookmark: normalizeEntry(bookmark.toObject()) };
}

// 🔹 Upsert a library entry (status / rating / note)
export async function upsertEntryService(userId, data) {
  const { mediaId, mediaType, status, rating, note } = data;

  const update = {};
  if (status !== undefined) update.status = status;
  if (rating !== undefined) update.rating = rating;
  if (note !== undefined) update.note = note;

  // Stamp watchedAt the first time something is marked watched.
  if (status === "watched") {
    const existing = await Bookmark.findOne({ userId, mediaId, mediaType });
    if (!existing?.watchedAt) update.watchedAt = new Date();
  }

  const entry = await Bookmark.findOneAndUpdate(
    { userId, mediaId, mediaType },
    { $set: update, $setOnInsert: { userId, mediaId, mediaType } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  return normalizeEntry(entry);
}

// 🔹 Remove an entry entirely
export async function removeEntryService(userId, mediaId, mediaType) {
  const query = { userId, mediaId: Number(mediaId) };
  if (mediaType) query.mediaType = mediaType;

  await Bookmark.deleteOne(query);
  return { removed: true };
}

// 🔹 Get all library entries for user
export async function getUserBookmarksService(userId) {
  const entries = await Bookmark.find({ userId }).lean();
  return entries.map(normalizeEntry);
}

// 🔹 Check if a media is in the library (used for UI)
export async function isBookmarkedService(userId, mediaId) {
  const bookmark = await Bookmark.findOne({ userId, mediaId });
  return !!bookmark;
}
