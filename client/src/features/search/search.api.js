import api from "../../services/api";

export const searchMulti = async (query) => {
  const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return res.data;
};
