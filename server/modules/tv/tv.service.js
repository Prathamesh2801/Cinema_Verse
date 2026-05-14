import tmdbClient from "../../config/tmdbClient.js";

import { filterMediaContent } from "../../utils/moderation/filterMediaContent.js";

// ======================================
// 📺 POPULAR TV
// ======================================

export async function getPopularTV(page = 1) {
  const res = await tmdbClient.get("/tv/popular", {
    params: { page },
  });

  const filteredResults = filterMediaContent(res.data.results, {
    minVoteCount: 500,
    minVoteAverage: 6.8,
    requirePoster: true,
  });

  return {
    ...res.data,
    results: filteredResults,
  };
}

// ======================================
// ⭐ TOP RATED TV
// ======================================

export async function getTopRatedTV(page = 1) {
  const res = await tmdbClient.get("/tv/top_rated", {
    params: { page },
  });

  const filteredResults = filterMediaContent(res.data.results, {
    minVoteCount: 800,
    minVoteAverage: 7,
    requirePoster: true,
  });

  return {
    ...res.data,
    results: filteredResults,
  };
}

// ======================================
// 🚀 AIRING TODAY
// ======================================

export async function getAiringTodayTV(page = 1) {
  const res = await tmdbClient.get("/tv/airing_today", {
    params: { page },
  });

  const filteredResults = filterMediaContent(res.data.results, {
    minVoteCount: 250,
    minVoteAverage: 6.5,
    requirePoster: true,
  });

  return {
    ...res.data,
    results: filteredResults,
  };
}

// ======================================
// 📺 TV DETAILS
// ======================================

export async function getTVDetails(id) {
  const res = await tmdbClient.get(`/tv/${id}`);

  return res.data;
}
