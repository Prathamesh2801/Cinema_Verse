import { useEffect, useState } from "react";
import { useBookmarks } from "../context/BookmarkContext";
import { getMovieDetails } from "../../movies/movie.api";
import { getTVDetails } from "../../tv/tv.api";

import MediaCard from "../../../components/MediaCard";

export default function BookmarkPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bookmarks } = useBookmarks();

  useEffect(() => {
    async function hydrate() {
      setLoading(true);

      try {
        const hydrated = await Promise.all(
          bookmarks.map(async (item) => {
            if (item.mediaType === "tv") {
              const data = await getTVDetails(item.mediaId);
              return { ...data, media_type: "tv" };
            } else {
              const data = await getMovieDetails(item.mediaId);
              return { ...data, media_type: "movie" };
            }
          }),
        );

        setItems(hydrated);
      } catch (err) {
        console.error("Hydration error:", err);
      } finally {
        setLoading(false);
      }
    }

    hydrate();
  }, [bookmarks]);

  if (loading) {
    return <div className="p-4">Loading bookmarks...</div>;
  }

  if (!items.length) {
    return <div className="p-4">No bookmarks yet</div>;
  }

  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
