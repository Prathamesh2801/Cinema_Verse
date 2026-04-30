import api from "../../services/api";

export const getBookmarks = async (token) => {
  const res = await api.get("/bookmark", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const toggleBookmark = async (item, token) => {
  const res = await api.post("/bookmark/toggle", item, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
