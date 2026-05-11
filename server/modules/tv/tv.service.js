import tmdbClient from "../../config/tmdbClient.js";
import { filterMediaContent } from "../../utils/moderation/filterMediaContent.js";

export async function getPopularTV() {
  const res = await tmdbClient.get("/tv/popular");

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

export async function getTopRatedTV() {
  const res = await tmdbClient.get("/tv/top_rated");

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

export async function getAiringTodayTV() {
  const res = await tmdbClient.get("/tv/airing_today");

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

export async function getTVDetails(id) {
  const res = await tmdbClient.get(`/tv/${id}`);
  return res.data;
}
