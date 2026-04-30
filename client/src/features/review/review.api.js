import api from "../../services/api";

export const getReviews = async (mediaId) => {
  const res = await api.get(`/review/${mediaId}`);
  return res.data;
};

export const createReview = async (data, token) => {
  const res = await api.post("/review", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const toggleLike = async (id, token) => {
  const res = await api.post(
    `/review/like/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

export const toggleDislike = async (id, token) => {
  const res = await api.post(
    `/review/dislike/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

export const createReply = async (data, token) => {
  const res = await api.post("/review/reply", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
