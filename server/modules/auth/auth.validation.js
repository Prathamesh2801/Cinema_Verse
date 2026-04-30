export function validateRegister(data) {
  const { username, password } = data;

  if (!username || username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }

  if (!password || password.length < 4) {
    throw new Error("Password must be at least 4 characters");
  }
}

export function validateLogin(data) {
  const { username, password } = data;

  if (!username || !password) {
    throw new Error("Username and password are required");
  }
}
