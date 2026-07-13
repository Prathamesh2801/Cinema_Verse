import api from "../../services/api";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// 🔹 Current user profile
export const getMe = async (token) => {
  const res = await api.get("/auth/me", authHeader(token));
  return res.data.user;
};

// 🔹 Update profile (fullName / avatar / username) → { token, user }
export const updateProfile = async (data, token) => {
  const res = await api.put("/auth/profile", data, authHeader(token));
  return res.data;
};

// 🔹 Change password → { message }
export const changePassword = async (data, token) => {
  const res = await api.put("/auth/password", data, authHeader(token));
  return res.data;
};
