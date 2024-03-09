import express from "express";

import {
  register,
  login,
  checkTokenValidity,
  logout,
} from "../controller/authController.js";

// middleware
import { checkSession } from "../middlewares/checksession.js";

const router = express.Router();

// add a middleware that will check if the user already has a valid session
router
  .post("/register", register)
  .post("/login", login)
  .get("/check-cookie-token", checkSession, checkTokenValidity)
  .get("/logout/:id", logout);

export default router;
