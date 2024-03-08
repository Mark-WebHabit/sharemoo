import express from "express";

// controllers
import { getAuthUser } from "../controller/userController.js";

const router = express.Router();

router.get("/", getAuthUser);

export default router;
