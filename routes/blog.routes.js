const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  createBlogCategory,
  getAllCategories,
} = require("../controllers/blog.controller");
const { authenticateToken } = require("../middleware/auth");

//to get all blogs.
router.get("/", getAllBlogs);

//to get all categories.
router.get("/categories", getAllCategories);

//to create a blog
router.post("/", authenticateToken, createBlog);

//to get a blog based on it's id.
router.get("/:id", getBlogById);

//to update blog.
router.put("/:id", authenticateToken, updateBlog);

//to delete a blog.
router.delete("/:id", authenticateToken, deleteBlog);

//to create a category.
router.post("/categories", createBlogCategory);

module.exports = router;
