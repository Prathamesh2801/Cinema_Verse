import api from "../../services/api";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getBookmarks = async (token) => {
  const res = await api.get("/bookmark", authHeader(token));
  return res.data;
};

// Quick "want" toggle (heart button)
export const toggleBookmark = async (item, token) => {
  const res = await api.post("/bookmark/toggle", item, authHeader(token));
  return res.data;
};

// Upsert a library entry (status / rating / note) → returns the entry
export const updateEntry = async (data, token) => {
  const res = await api.put("/bookmark", data, authHeader(token));
  return res.data;
};

// Remove an entry entirely
export const removeEntry = async (mediaId, mediaType, token) => {
  const res = await api.delete(
    `/bookmark/${mediaId}?mediaType=${mediaType}`,
    authHeader(token),
  );
  return res.data;
};
