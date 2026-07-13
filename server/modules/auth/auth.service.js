import User from "./auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

// Shape the user object we expose to the client (never the password hash).
function toPublicUser(user) {
  return {
    id: user._id,
    username: user.username,
    fullName: user.fullName || "",
    avatar: user.avatar || "",
  };
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export async function registerUserService(data) {
  const username = data.username.toLowerCase();
  const { password, fullName } = data;

  const existing = await User.findOne({ username });
  if (existing) throw new Error("User exists");

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    username,
    password: hash,
    fullName: fullName?.trim() || "",
  });

  return {
    token: signToken(user),
    user: toPublicUser(user),
  };
}

export async function loginUserService(data) {
  const username = data.username.toLowerCase();
  const { password } = data;

  const user = await User.findOne({ username }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return {
    token: signToken(user),
    user: toPublicUser(user),
  };
}

export async function getMeService(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return toPublicUser(user);
}

export async function updateProfileService(userId, data) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const { fullName, avatar, username } = data;

  // Username change — enforce uniqueness (case-insensitive) excluding self.
  if (username !== undefined) {
    const next = username.toLowerCase();
    if (next !== user.username) {
      const taken = await User.findOne({ username: next });
      if (taken) throw new Error("Username already taken");
      user.username = next;
    }
  }

  if (fullName !== undefined) user.fullName = fullName.trim();
  if (avatar !== undefined) user.avatar = avatar.trim();

  await user.save();

  // Reissue token so the embedded username stays in sync after a rename.
  return {
    token: signToken(user),
    user: toPublicUser(user),
  };
}

export async function changePasswordService(userId, data) {
  const { currentPassword, newPassword } = data;

  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();

  return { message: "Password updated successfully" };
}
