// src/controllers/user.controller.js
import bcrypt from "bcryptjs";
import { users, getNextUserId, resetTokens } from "../data/mock.js";
import { signToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";

const auiEmailRegex = /^[a-z]{1,2}\.[a-z]+@aui\.ma$/i;

const isAuiEmail = (email) => auiEmailRegex.test(email);

// ---------- AUTH ----------

export const register = (req, res) => {
  const { username, email, password, role } = req.body || {};

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "username, email and password are required" });
  }

  if (!isAuiEmail(email)) {
    return res.status(400).json({
      error:
        "Email must be an AUI email in the format n.bachiri@aui.ma or na.bachiri@aui.ma",
    });
  }

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: "User with this email already exists" });
  }

  const hashed = bcrypt.hashSync(password, 10);

  const normalizedRole =
    role === "ADMIN" || role === "SUPERADMIN" ? role : "STUDENT";

  const newUser = {
    id: getNextUserId(),
    username,
    email: email.toLowerCase(),
    role: normalizedRole,
    password: hashed,
    balance: 0, // default CashWallet balance
  };

  users.push(newUser);

  const token = signToken({
    id: newUser.id,
    username: newUser.username,
    role: newUser.role,
    email: newUser.email,
  });

  res.status(201).json({
    message: "Registered successfully",
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      balance: newUser.balance,
    },
    token,
  });
};

export const login = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "email and password are required" });
  }

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) return res.status(404).json({ error: "User not found" });

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Wrong password" });
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
  });

  res.json({
    message: "Logged in",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      balance: user.balance,
    },
  });
};

export const getMe = (req, res) => {
  const { id, username, email, role, balance } = req.user;
  res.json({ id, username, email, role, balance });
};

export const getAllUsers = (req, res) => {
  const clean = users.map(({ password, ...rest }) => rest);
  res.json(clean);
};

// ---------- FORGOT / RESET PASSWORD ----------

const generateToken = () =>
  Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

export const forgotPassword = (req, res) => {
  const { email } = req.body || {};

  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) {
    // For security we still return success
    return res.json({
      message: "If this email exists, a reset link has been sent.",
    });
  }

  const token = generateToken();
  const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour

  resetTokens.push({ token, userId: user.id, expiresAt });

  const resetLink = `https://courtconnect.aui.ma/reset-password?token=${token}`;

  sendEmail(
    user.email,
    "CourtConnect – Password Reset",
    `Hi ${user.username},\n\nYou requested to reset your password. Click the link below to set a new password (valid for 1 hour):\n${resetLink}\n\nIf you did not request this, you can ignore this email.`
  );

  res.json({ message: "Password reset link sent to your AUI email." });
};

export const resetPassword = (req, res) => {
  const { token, newPassword } = req.body || {};

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: "token and newPassword are required" });
  }

  const recordIndex = resetTokens.findIndex((r) => r.token === token);
  if (recordIndex === -1) {
    return res.status(400).json({ error: "Invalid or expired reset token." });
  }

  const record = resetTokens[recordIndex];
  if (Date.now() > record.expiresAt) {
    resetTokens.splice(recordIndex, 1);
    return res.status(400).json({ error: "Reset token has expired." });
  }

  const user = users.find((u) => u.id === record.userId);
  if (!user) {
    resetTokens.splice(recordIndex, 1);
    return res.status(400).json({ error: "User not found." });
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  resetTokens.splice(recordIndex, 1);

  sendEmail(
    user.email,
    "CourtConnect – Password Changed",
    `Hi ${user.username},\n\nYour password has been successfully changed.`
  );

  res.json({ message: "Password has been reset successfully." });
};
