import tmdbClient from "../../config/tmdbClient.js";
import { filterMediaContent } from "../../utils/moderation/filterMediaContent.js";

export async function searchMulti(query, page = 1) {
  const res = await tmdbClient.get("/search/multi", {
    params: { query, page, include_adult: false },
  });

  const raw = res.data.results || [];

  // Split media vs people — they need different gating.
  const media = raw.filter(
    (item) => item.media_type === "movie" || item.media_type === "tv",
  );
  const people = raw.filter(
    (item) => item.media_type === "person" && item.profile_path,
  );

  // Relaxed moderation for search: the user typed a specific query, so favor
  // recall (find the title) over the strict quality floor used on browse rows.
  const filteredMedia = filterMediaContent(media, {
    minVoteCount: 5,
    minVoteAverage: 0,
    requirePoster: true,
  });

  // Rebuild from the original list to preserve TMDB's relevance ordering
  // (people interleaved where TMDB ranked them).
  const allowed = new Set(
    [...filteredMedia, ...people].map((i) => `${i.media_type}-${i.id}`),
  );
  const results = raw.filter((i) => allowed.has(`${i.media_type}-${i.id}`));

  return {
    results,
    page: res.data.page,
    total_pages: res.data.total_pages,
    total_results: res.data.total_results,
  };
}
