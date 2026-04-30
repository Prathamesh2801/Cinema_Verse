import tmdbClient from "../../config/tmdbClient.js";

export async function getPopularMovies() {
  const res = await tmdbClient.get("/movie/popular");
  return res.data;
}

export async function getMovieDetails(id) {
  const res = await tmdbClient.get(`/movie/${id}`);
  return res.data;
}

export async function discoverMovies(params = {}) {
  const res = await tmdbClient.get("/discover/movie", {
    params,
  });
  return res.data;
}
