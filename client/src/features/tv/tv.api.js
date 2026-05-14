import api from "../../services/api";

// 🔹 Popular TV
export const getPopularTV = async (page = 1) => {
  const res = await api.get(`/tv/popular?page=${page}`);

  return res.data.map((item) => ({
    ...item,
    media_type: "tv",
  }));
};

// 🔹 Top Rated TV
export const getTopRatedTV = async (page = 1) => {
  const res = await api.get(`/tv/top-rated?page=${page}`);

  return res.data.map((item) => ({
    ...item,
    media_type: "tv",
  }));
};

// 🔹 Latest / Airing Today
export const getLatestTV = async (page = 1) => {
  const res = await api.get(`/tv/airing-today?page=${page}`);

  return res.data.map((item) => ({
    ...item,
    media_type: "tv",
  }));
};

// 🔹 TV Details
export const getTVDetails = async (id) => {
  const res = await api.get(`/tv/${id}`);

  return res.data;
};
