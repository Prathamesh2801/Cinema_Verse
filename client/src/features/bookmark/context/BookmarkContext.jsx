import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { getBookmarks, toggleBookmark } from "../bookmark.api";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const { token } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  const fetchBookmarks = async () => {
    if (!token) return;

    const data = await getBookmarks(token);
    setBookmarks(data);
  };

  useEffect(() => {
    fetchBookmarks();
  }, [token]);

  const toggle = async (item) => {
    await toggleBookmark(
      {
        mediaId: item.id,
        mediaType: item.media_type,
      },
      token,
    );

    setBookmarks((prev) => {
      const exists = prev.find(
        (b) => b.mediaId === item.id && b.mediaType === item.media_type,
      );

      if (exists) {
        return prev.filter(
          (b) => !(b.mediaId === item.id && b.mediaType === item.media_type),
        );
      }

      return [
        ...prev,
        {
          mediaId: item.id,
          mediaType: item.media_type,
        },
      ];
    });
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggle }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);
