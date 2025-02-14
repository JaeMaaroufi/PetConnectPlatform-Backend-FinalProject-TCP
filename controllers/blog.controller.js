const Blog = require("../models/Blog");
const BlogCategory = require("../models/BlogCategory");
const BlogComments = require("../models/BlogComment");

// Get all blogs
const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate({
      path: "author",
      select: "fullname email",
    });
    res.status(200).json({ blogs });
  } catch (error) {
    next(error);
  }
};

// Get a single blog by ID
const getBlogById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate({
      path: "author",
      select: "fullname email",
    });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

// Create a blog
const createBlog = async (req, res, next) => {
  try {
    const { intro, title, content, image, categories } = req.body;
    const author = req.user;
    const authorId = req.user.id;

    if (author.role !== "store") {
      return res.status(403).json({ error: "Unauthorized to create blogs" });
    }

    if (!intro || !title || !content) {
      return res
        .status(400)
        .json({ error: "Intro, title, and content are required" });
    }

    const categoryIds = await BlogCategory.find({
      name: { $in: categories },
    }).distinct("_id");

    if (categoryIds.length !== categories.length) {
      return res
        .status(404)
        .json({ error: "One or more categories not found" });
    }

    const newBlog = await Blog.create({
      intro,
      title,
      content,
      image,
      categories: categoryIds,
      author: authorId,
    });

    await newBlog.populate("author", "fullname email");

    for (const categoryId of categoryIds) {
      await BlogCategory.findByIdAndUpdate(categoryId, {
        $push: { blogs: newBlog._id },
      });
    }

    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    next(error);
  }
};

// Update a blog by ID
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to edit this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    next(error);
  }
};

// Delete a blog by ID
const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this blog" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (error) {
    next(error);
  }
};

//create a category
const createBlogCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const existingCategory = await BlogCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }
    const newCategory = await BlogCategory.create({ name });

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.find().populate({
      path: "blogs",
      select: "_id",
    });

    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  createBlogCategory,
  getAllCategories,
};
