import tmdbClient from "../../config/tmdbClient.js";
import { filterMediaContent } from "../../utils/moderation/filterMediaContent.js";

export async function getPopularMovies() {
  const res = await tmdbClient.get("/movie/popular");

  const filteredResults = filterMediaContent(res.data.results, {
    minVoteCount: 500,
    minVoteAverage: 6.5,
    requirePoster: true,
  });

  return {
    ...res.data,
    results: filteredResults,
  };
}

export async function discoverMovies(params = {}, moderationConfig = {}) {
  const res = await tmdbClient.get("/discover/movie", {
    params,
  });

  const filteredResults = filterMediaContent(res.data.results, {
    minVoteCount: 300,
    minVoteAverage: 6.2,
    requirePoster: true,
    ...moderationConfig,
  });

  return {
    ...res.data,
    results: filteredResults,
  };
}

export async function getMovieDetails(id) {
  const res = await tmdbClient.get(`/movie/${id}`);
  return res.data;
}
