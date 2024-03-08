import { pool } from "../database/db.js";
import asyncHandler from "express-async-handler";

// in future development i should fecth all post of those user who are friend of this user
export const fetchAllPosts = asyncHandler(async (req, res) => {
  let offset = parseInt(req.query?.offset) || 0; // Ensure offset is a number
  let limit = parseInt(req.query?.limit) || 10; // Ensure limit is a number

  // Dynamically inserting LIMIT and OFFSET values directly in the query
  // This approach should be used cautiously and is shown here for troubleshooting.
  // Ensure 'offset' and 'limit' are properly sanitized and validated to prevent SQL Injection.
  const query = `SELECT p.id, p.text_content, p.photo_content, u.username, p.created_at, u.profile FROM posts as p INNER JOIN users as u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset};`;

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