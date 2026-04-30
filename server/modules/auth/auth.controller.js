import { registerUserService, loginUserService } from "./auth.service.js";
import { validateLogin, validateRegister } from "./auth.validation.js";

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
