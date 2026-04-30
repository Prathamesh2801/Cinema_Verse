import api from "../../services/api";

// 🔹 Popular TV
export const getPopularTV = async () => {
  const res = await api.get("/tv/popular");

  return res.data.map((item) => ({
    ...item,
    media_type: "tv",
  }));
};

// 🔹 Top Rated TV
export const getTopRatedTV = async () => {
  const res = await api.get("/tv/top-rated");

  return res.data.map((item) => ({
    ...item,
    media_type: "tv",
  }));
};

// 🔹 Latest / Airing Today
export const getLatestTV = async () => {
  const res = await api.get("/tv/airing-today");

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
