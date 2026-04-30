const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);

  const addBookmark = async (item) => {
    // call backend
    setBookmarks((prev) => [...prev, item]);
  };

  const removeBookmark = async (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, addBookmark, removeBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
