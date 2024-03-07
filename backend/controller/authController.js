import { pool } from "../database/db.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing Payload" });
  }

  if (username.length < 4)
    return res.status(400).json({
      success: false,
      message: "Username too short: Must be atleast 4 characters",
    });

  const validEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validEmailFormat.test(email))
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });

  if (password.length < 6)
    return res.status(400).json({
      success: false,
      message: "Password too short: Must be atleast 6 characters",
    });

  let usernameColumnQuery = "SELECT * FROM users WHERE username = ?";
  const [exisitingUsername] = await pool.execute(usernameColumnQuery, [
    username,
  ]);
  if (exisitingUsername.length > 0)
    return res
      .status(409)
      .json({ success: false, message: "Username already exists" });

  let emailColumnQuery = "SELECT * FROM users WHERE email = ?";
  const [exisitingEmail] = await pool.execute(emailColumnQuery, [email]);
  if (exisitingEmail.length > 0)
    return res
      .status(409)
      .json({ success: false, message: "Email already exists" });

  const hashedPass = await bcrypt.hash(password, 10);
  let query = "INSERT INTO users (username, email, password) values (?,?,?)";
  const result = await pool.execute(query, [username, email, hashedPass]);

  return res.status(201).json({ success: true, data: result });
});
