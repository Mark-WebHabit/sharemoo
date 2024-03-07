import asyncHandler from "express-async-handler";

export const getCookie = asyncHandler(async (req, res, next) => {
  console.log(res.cookie);
  if (!res.cookie?.access_token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
});
