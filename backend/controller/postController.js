import { pool } from "../database/db.js";
import asyncHandler from "express-async-handler";

// in future development i should fecth all post of those user who are friend of this user
export const fetchAllPosts = asyncHandler(async (req, res) => {
  let offset = parseInt(req.query?.offset) || 0; // Ensure offset is a number
  let limit = parseInt(req.query?.limit) || 10; // Ensure limit is a number

  // Ensure 'offset' and 'limit' are properly sanitized and validated to prevent SQL Injection.
  const query = `SELECT p.id as post_id, p.text_content, p.photo_content, u.id as user_id, u.username, p.created_at, u.profile FROM posts as p INNER JOIN users as u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset};`;

  try {
    // Execute the query without parameter array since values are directly in the query string
    const [posts] = await pool.execute(query);

    // If there are no posts, this returns an empty array as before
    return res.json({ success: true, data: posts });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export const authUserPosts = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  let offset = parseInt(req.query?.offset) || 0; // Ensure offset is a number
  let limit = parseInt(req.query?.limit) || 10; // Ensure limit is a number

  try {
    if (!user_id)
      return res.status(400).json({
        success: false,
        message: "Cannot Add Like: Missing Arguments",
      });

    let query = "SELECT username FROM users WHERE id = ? ";
    const [user] = await pool.execute(query, [user_id]);

    if (!user || user.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User" });

    // Ensure 'offset' and 'limit' are properly sanitized and validated to prevent SQL Injection.
    query = `SELECT p.id as post_id, p.text_content, p.photo_content, u.id as user_id, u.username, p.created_at, u.profile FROM posts as p INNER JOIN users as u ON p.user_id = u.id WHERE u.id = ? ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset} `;
    // Execute the query without parameter array since values are directly in the query string
    const [posts] = await pool.execute(query, [user_id]);

    // If there are no posts, this returns an empty array as before
    return res.json({ success: true, data: posts || [] });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export const addPost = asyncHandler(async (req, res) => {
  const { id, text_content, photo_content } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Cannot Create Post: Invalid Arguments",
    });
  }

  if (text_content === "" && photo_content === "")
    return res.status(400).json({
      success: false,
      message: "Cannot Create Post: Invalid Arguments",
    });

  const query =
    "INSERT INTO posts (user_id, text_content, photo_content) values (?,?,?)";

  let bindParam;

  if (text_content && !photo_content) {
    bindParam = [id, text_content, null];
  } else if (!text_content && photo_content) {
    bindParam = [id, null, photo_content];
  } else {
    bindParam = [id, text_content, photo_content];
  }

  const result = await pool.execute(query, bindParam);

  if (!result)
    return res.status(400).json({
      success: false,
      message: "Failed To Create Post: Something Went Wrong",
    });
  const insertedId = result[0].insertId;

  const newquery = `SELECT p.id, p.text_content, p.photo_content, u.username, p.created_at, u.profile FROM posts as p INNER JOIN users as u ON p.user_id = u.id  WHERE p.id = ?`;
  const [newdata] = await pool.execute(newquery, [insertedId]);
  return res.status(201).json({ success: true, data: newdata });
});

export const getLikes = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      success: false,
      message: "Cannot Add Like: Missing Argument ID",
    });

  let query = "SELECT COUNT(*)  FROM post_likes WHERE post_id = ?";
  const [post] = await pool.execute(query, [id]);

  let count = post[0]["COUNT(*)"];
  return res.json({ success: true, data: count });
});

export const getPostLikers = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      success: false,
      message: "Cannot Add Like: Missing Argument ID",
    });

  let query =
    "select u.id from post_likes pl join users u on pl.user_id = u.id where pl.post_id = ?";

  let [likers] = await pool.execute(query, [id]);

  return res.json({ success: true, data: likers || [] });
});

export const addLike = asyncHandler(async (req, res) => {
  const { user_id, post_id } = req.body;

  if (!user_id || !post_id)
    return res
      .status(400)
      .json({ success: false, message: "Cannot Add Like: Missing Arguments" });

  let query = "SELECT username FROM users WHERE id = ? ";
  const [user] = await pool.execute(query, [user_id]);

  if (!user || user.length === 0)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized User" });

  query = "SELECT *  FROM posts WHERE id = ?";
  const [post] = await pool.execute(query, [post_id]);

  if (!post || post.length === 0)
    return res
      .status(401)
      .json({ success: false, message: "Post Not Available" });

  query = "INSERT INTO post_likes (post_id, user_id) values (? ,?)";
  const result = await pool.execute(query, [post_id, user_id]);

  return res.status(201).json({ success: true, data: result || [] });
});

export const removeLike = asyncHandler(async (req, res) => {
  const { user_id, post_id } = req.body;

  if (!user_id || !post_id)
    return res
      .status(400)
      .json({ success: false, message: "Cannot Add Like: Missing Arguments" });

  let query = "SELECT username FROM users WHERE id = ? ";
  const [user] = await pool.execute(query, [user_id]);

  if (!user || user.length === 0)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized User" });

  query = "SELECT *  FROM posts WHERE id = ?";
  const [post] = await pool.execute(query, [post_id]);

  if (!post || post.length === 0)
    return res
      .status(401)
      .json({ success: false, message: "Post Not Available" });

  query = "DELETE FROM post_likes WHERE user_id = ? AND post_id = ?";
  const [row] = await pool.execute(query, [user_id, post_id]);

  return res.status(201).json({ success: true, data: row || [] });
});

export const addProfile = asyncHandler(async (req, res) => {
  const { user_id, downloadUrl } = req.body;

  if (!user_id && !downloadUrl)
    return res.status(400).json({
      success: false,
      message: "Cannot Update Profile: Missing Arguments",
    });

  let query = "SELECT username FROM users WHERE id = ? ";
  const [user] = await pool.execute(query, [user_id]);

  if (!user || user.length === 0)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized User" });

  query = "UPDATE users SET profile = ? WHERE id = ?";
  const result = await pool.execute(query, [downloadUrl, user_id]);
  //result[0].affectedRows

  return res.status(201).json({ success: true, data: result || [] });
});
