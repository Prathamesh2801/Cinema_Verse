import { getMovieDetails } from "../features/movies/movie.api";
import { getTVDetails } from "../features/tv/tv.api";

export async function hydrateBookmark(item) {
  if (item.mediaType === "tv") {
    const data = await getTVDetails(item.mediaId);

    return {
      ...data,
      media_type: "tv",
    };
  }

  const data = await getMovieDetails(item.mediaId);

  return {
    ...data,
    media_type: "movie",
  };
}
