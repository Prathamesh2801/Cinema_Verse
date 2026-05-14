import tmdbClient from "../../config/tmdbClient.js";

import { filterMediaContent } from "../../utils/moderation/filterMediaContent.js";

// ======================================
// 🔥 POPULAR MOVIES
// ======================================

export async function getPopularMovies(page = 1) {
  const res = await tmdbClient.get("/movie/popular", {
    params: { page },
  });

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

// ======================================
// ⭐ DISCOVER MOVIES
// ======================================

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

// ======================================
// 🎬 MOVIE DETAILS
// ======================================

export async function getMovieDetails(id) {
  const res = await tmdbClient.get(`/movie/${id}`);

  return res.data;
}
