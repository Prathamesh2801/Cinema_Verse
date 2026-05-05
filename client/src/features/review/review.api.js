import api from "../../services/api";

export const getReviews = async (mediaId) => {
  const res = await api.get(`/review/${mediaId}`);
  return res.data.data;
};

export const createReview = async (data, token) => {
  const res = await api.post("/review", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const updateReview = async (id, data, token) => {
  const res = await api.put(`/review/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const deleteReview = async (id, token) => {
  const res = await api.delete(`/review/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const toggleLike = async (id, token) => {
  const res = await api.post(
    `/review/${id}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data.data;
};

export const toggleDislike = async (id, token) => {
  const res = await api.post(
    `/review/${id}/dislike`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data.data;
};

export const createReply = async (data, token) => {
  const res = await api.post("/review/reply", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
