import express from "express";

// controller
import { fetchAllPosts, addPost } from "../controller/postController.js";
const router = express.Router();

router.get(`/`, fetchAllPosts).post("/new", addPost);

export default router;
