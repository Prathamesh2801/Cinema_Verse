/* Data-fetching context: it intentionally sets state inside effects keyed on
   the token. Opt out of the (overly strict) set-state-in-effect rule. */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "../../auth/context/AuthContext";
import {
  getBookmarks,
  toggleBookmark,
  updateEntry,
  removeEntry,
} from "../bookmark.api";

const BookmarkContext = createContext();

const keyOf = (mediaId, mediaType) => `${mediaId}-${mediaType}`;

export function BookmarkProvider({ children }) {
  const { token } = useAuth();
  const [entries, setEntries] = useState([]);

  const fetchEntries = useCallback(async () => {
    if (!token) {
      setEntries([]);
      return;
    }
    try {
      const data = await getBookmarks(token);
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      /* keep whatever we have */
    }
  }, [token]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const getEntry = useCallback(
    (id, type) =>
      entries.find((e) => e.mediaId === Number(id) && e.mediaType === type) ||
      null,
    [entries],
  );

  const mergeEntry = (entry) => {
    setEntries((prev) => {
      const k = keyOf(entry.mediaId, entry.mediaType);
      return [...prev.filter((e) => keyOf(e.mediaId, e.mediaType) !== k), entry];
    });
  };

  const dropEntry = (mediaId, mediaType) => {
    setEntries((prev) =>
      prev.filter((e) => !(e.mediaId === mediaId && e.mediaType === mediaType)),
    );
  };

  // Quick heart toggle — add as "want" if absent, else remove from library.
  const toggle = async (item) => {
    const mediaId = Number(item.id);
    const mediaType = item.media_type;
    const existing = getEntry(mediaId, mediaType);

    if (existing) {
      dropEntry(mediaId, mediaType);
    } else {
      mergeEntry({
        mediaId,
        mediaType,
        status: "want",
        rating: 0,
        note: "",
        watchedAt: null,
      });
    }

    try {
      await toggleBookmark({ mediaId, mediaType }, token);
    } catch {
      fetchEntries();
    }
  };

  // Upsert status / rating / note for an item.
  const upsert = async (item, patch) => {
    const mediaId = Number(item.id);
    const mediaType = item.media_type;
    try {
      const entry = await updateEntry({ mediaId, mediaType, ...patch }, token);
      mergeEntry(entry);
      return entry;
    } catch {
      fetchEntries();
      return null;
    }
  };

  const setStatus = (item, status) => upsert(item, { status });
  const setRating = (item, rating) => upsert(item, { rating });
  const setNote = (item, note) => upsert(item, { note });

  const remove = async (item) => {
    const mediaId = Number(item.id);
    const mediaType = item.media_type;
    dropEntry(mediaId, mediaType);
    try {
      await removeEntry(mediaId, mediaType, token);
    } catch {
      fetchEntries();
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        entries,
        bookmarks: entries, // backward-compat alias
        getEntry,
        toggle,
        setStatus,
        setRating,
        setNote,
        remove,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);
export const useLibrary = () => useContext(BookmarkContext);
