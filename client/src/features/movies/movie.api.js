import api from "../../services/api";

// 🔹 Popular Movies
export const getPopularMovies = async (page = 1) => {
  const res = await api.get(`/movies/popular?page=${page}`);

  return res.data.map((item) => ({
    ...item,
    media_type: "movie",
  }));
};

// 🔹 Top Rated Movies
export const getTopRatedMovies = async (page = 1) => {
  const res = await api.get(`/movies/top-rated?page=${page}`);

  return res.data.map((item) => ({
    ...item,
    media_type: "movie",
  }));
};

// 🔹 Latest Movies
export const getLatestMovies = async (page = 1) => {
  const res = await api.get(`/movies/latest?page=${page}`);

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
