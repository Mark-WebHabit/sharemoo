import express from "express";

// controllers
import { getAuthUser, getUserById } from "../controller/userController.js";

const router = express.Router();

router.get("/", getAuthUser).get("/:user_id", getUserById);

export default router;
