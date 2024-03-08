import { pool } from "../database/db.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All Fields required" });
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

export const login = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (usernameOrEmail == "" || password == "") {
    return res
      .status(400)
      .json({ success: false, message: "All Fields required" });
  }

  let findQuery = "SELECT * FROM users WHERE username = ? or email = ?";
  const [users] = await pool.execute(findQuery, [
    usernameOrEmail,
    usernameOrEmail,
  ]);

  if (!users || users.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Wrong username or password" });
  }

  const user = users[0];

  const ismatch = await bcrypt.compare(password, user.password);

  if (!ismatch) {
    return res
      .status(400)
      .json({ success: false, message: "Wrong username or password" });
  }

  const token = await jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = await jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  let updateRefreshTokenQuery =
    "UPDATE users SET refresh_token = ? WHERE id = ?";
  let result = await pool.execute(updateRefreshTokenQuery, [
    refreshToken,
    user.id,
  ]);

  if (result.affectedRows === 0) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }

  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 3600000),
    })
    .json({ success: true, message: "Login Successful" });
});

export const checkTokenValidity = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.access_token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Login Required" });
  }

  jwt.verify(
    cookie.access_token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        const decodedPayload = jwt.decode(cookie.access_token);
        let refreshTokenQuery = "SELECT refresh_token FROM users WHERE id = ?";
        const [refreshToken] = await pool.execute(refreshTokenQuery, [
          decodedPayload.id,
        ]);

        if (refreshToken.length == 0 || !refreshToken) {
          return res
            .status(403)
            .json({ success: false, message: "You are not allowed here!" });
        }

        const userRefreshToken = refreshToken[0];

        jwt.verify(
          userRefreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          async (err, decoded) => {
            if (err) {
              return res
                .status(403)
                .json({ success: false, message: "Session Expired" });
            }

            const { id, username } = decoded;

            const newAccessToken = jwt.sign(
              { id, username },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1h" }
            );

            return res
              .cookie("access_token", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                expires: new Date(Date.now() + 3600000),
              })
              .json({ success: true, message: "Login Successful" });
          }
        );
      } else {
        return res.json({ success: true, message: "User Authorized" });
      }
    }
  );
});
