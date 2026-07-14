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

// 🔹 Upload avatar image (multipart) → { user }
export const uploadAvatar = async (file, token, onUploadProgress) => {
  const formData = new FormData();
  formData.append("avatar", file);

  // Let the browser set the multipart boundary — don't set Content-Type manually.
  const res = await api.post("/auth/avatar", formData, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress,
  });
  return res.data;
};

// 🔹 Remove avatar (back to initials) → { user }
export const removeAvatar = async (token) => {
  const res = await api.delete("/auth/avatar", authHeader(token));
  return res.data;
};

// 🔹 Change password → { message }
export const changePassword = async (data, token) => {
  const res = await api.put("/auth/password", data, authHeader(token));
  return res.data;
};
