import User from "./auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export async function registerUserService(data) {
  const username = data.username.toLowerCase();
  const { password } = data;
  const existing = await User.findOne({ username });
  if (existing) throw new Error("User exists");

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    username,
    password: hash,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
    },
  };
}

export async function loginUserService(data) {
  const username = data.username.toLowerCase();
  const { password } = data;

  const user = await User.findOne({ username }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
    },
  };
}
