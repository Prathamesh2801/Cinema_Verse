import tmdbClient from "../../config/tmdbClient.js";

export async function getPopularTV() {
  const res = await tmdbClient.get("/tv/popular");
  return res.data;
}

export async function getTopRatedTV() {
  const res = await tmdbClient.get("/tv/top_rated");
  return res.data;
}

export async function getAiringTodayTV() {
  const res = await tmdbClient.get("/tv/airing_today");
  return res.data;
}

export async function getTVDetails(id) {
  const res = await tmdbClient.get(`/tv/${id}`);
  return res.data;
}
