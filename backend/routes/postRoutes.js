import express from "express";

// controller
import {
  fetchAllPosts,
  addPost,
  addLike,
  getLikes,
  getPostLikers,
  removeLike,
  authUserPosts,
  addProfile,
} from "../controller/postController.js";
const router = express.Router();

router
  .get(`/`, fetchAllPosts)
  .get("/:user_id", authUserPosts)
  .post("/new", addPost)
  .post("/like", addLike)
  .post("/unlike", removeLike)
  .get("/likes/:id", getLikes)
  .get("/likers/:id", getPostLikers)
  .post("/upload-profile", addProfile);

export default router;
