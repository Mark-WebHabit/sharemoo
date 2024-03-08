import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { pool } from "../database/db.js";

export const checkSession = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.access_token;

  if (!accessToken)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        const { id, username } = jwt.decode(accessToken);

        if (!id || !username)
          return res.status(403).json({
            success: false,
            message: "Invalid Authorization Credentials",
          });

        let query = "SELECT * FROM users WHERE id = ?";
        const [response1] = await pool.execute(query, [id]);

        if (response1.length == 0 || !response1)
          return res
            .status(403)
            .json({ success: false, message: "Unknown User" });

        query = "SELECT username FROM users WHERE username = ?";
        const [response2] = await pool.execute(query, [username]);

        if (response2.length == 0 || !response2)
          return res
            .status(403)
            .json({ success: false, message: "Unknown User" });

        if (response1[0].username !== response2[0].username)
          return res
            .status(403)
            .json({ success: false, message: "Invalid User" });

        const refreshToken = response1[0].refresh_token;

        if (!refreshToken)
          return res
            .status(401)
            .json({ success: false, message: "Login required!" });

        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err) {
              return res
                .status(401)
                .json({ success: false, message: "Session Expired" });
            }

            const newToken = jwt.sign(
              { id, username },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1h" }
            );

            res.cookie("access_token", newToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
              expires: new Date(Date.now() + 3600000),
            });

            next();
          }
        );
      }

      next();
    }
  );
});
