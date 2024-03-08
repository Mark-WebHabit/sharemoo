import { pool } from "../database/db.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAuthUser = asyncHandler(async (req, res) => {
  const access_token = req.cookies?.access_token;

  if (!access_token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  // the security is handled in the middleware, repeating thee same step here can be reedundant that's why this function looks plane
  // the access token is already been verifified and refreshed when necessary using the middleware checksession so i dont want to repeat the same step here

  const { id, username } = jwt.decode(access_token);

  if (!id)
    return res.status(403).json({ success: false, message: "Unknown User" });

  let query = "SELECT username, id, profile, email FROM users WHERE id = ?";
  const [response] = await pool.execute(query, [id]);

  if (response.length == 0) {
    return res
      .status(404)
      .json({ success: false, message: "Unknown Logged In User" });
  }

  return res.json({ success: true, data: response });
});
