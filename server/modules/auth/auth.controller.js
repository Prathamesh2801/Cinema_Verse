import {
  registerUserService,
  loginUserService,
  getMeService,
  updateProfileService,
  updateAvatarService,
  removeAvatarService,
  changePasswordService,
} from "./auth.service.js";
import {
  validateLogin,
  validateRegister,
  validateProfileUpdate,
  validatePasswordChange,
} from "./auth.validation.js";

export async function register(req, res) {
  try {
    validateRegister(req.body);
    const { token, user } = await registerUserService(req.body);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    validateLogin(req.body);
    const { token, user } = await loginUserService(req.body);

    res.json({ token, user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

export async function getMe(req, res) {
  try {
    const user = await getMeService(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    validateProfileUpdate(req.body);
    const { token, user } = await updateProfileService(req.user.id, req.body);

    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateAvatar(req, res) {
  try {
    const user = await updateAvatarService(req.user.id, req.file);
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function removeAvatar(req, res) {
  try {
    const user = await removeAvatarService(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function changePassword(req, res) {
  try {
    validatePasswordChange(req.body);
    const result = await changePasswordService(req.user.id, req.body);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
