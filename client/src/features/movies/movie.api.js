import api from "../../services/api";

// 🔹 Popular Movies
export const getPopularMovies = async () => {
  const res = await api.get("/movies/popular");
  return res.data.map((item) => ({
    ...item,
    media_type: "movie",
  }));
};

// 🔹 Top Rated Movies
export const getTopRatedMovies = async () => {
  const res = await api.get("/movies/top-rated");
  return res.data.map((item) => ({
    ...item,
    media_type: "movie",
  }));
};

// 🔹 Latest Movies (or now playing)
export const getLatestMovies = async () => {
  const res = await api.get("/movies/latest");
  return res.data.map((item) => ({
    ...item,
    media_type: "movie",
  }));
};

// 🔹 Movie Details
export const getMovieDetails = async (id) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};
