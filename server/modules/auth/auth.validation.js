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

export function validateProfileUpdate(data) {
  const { username, fullName, avatar } = data;

  if (username !== undefined && (!username || username.trim().length < 3)) {
    throw new Error("Username must be at least 3 characters");
  }

  if (fullName !== undefined && fullName.length > 60) {
    throw new Error("Full name is too long");
  }

  if (avatar !== undefined && avatar.length > 2000) {
    throw new Error("Avatar URL is too long");
  }
}

export function validatePasswordChange(data) {
  const { currentPassword, newPassword } = data;

  if (!currentPassword) {
    throw new Error("Current password is required");
  }

  if (!newPassword || newPassword.length < 4) {
    throw new Error("New password must be at least 4 characters");
  }
}
