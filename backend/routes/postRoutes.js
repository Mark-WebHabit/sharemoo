import express from "express";

// controller
import {
  fetchAllPosts,
  addPost,
  addLike,
  getLikes,
  getPostLikers,
  removeLike,
} from "../controller/postController.js";
const router = express.Router();

router
  .get(`/`, fetchAllPosts)
  .post("/new", addPost)
  .post("/like", addLike)
  .post("/unlike", removeLike)
  .get("/likes/:id", getLikes)
  .get("/likers/:id", getPostLikers);

export default router;
