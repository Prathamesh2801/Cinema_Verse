import tmdbClient from "../../config/tmdbClient.js";
import { filterMediaContent } from "../../utils/moderation/filterMediaContent.js";

export async function searchMulti(query) {
  const res = await tmdbClient.get("/search/multi", {
    params: { query },
  });

  // Remove people results
  const mediaOnlyResults = res.data.results.filter(
    (item) => item.media_type !== "person",
  );

  // Moderate + curate results
  const filteredResults = filterMediaContent(mediaOnlyResults, {
    minVoteCount: 100,
    minVoteAverage: 5.5,
    requirePoster: true,
  });

  return {
    ...res.data,
    results: filteredResults,
  };
}
