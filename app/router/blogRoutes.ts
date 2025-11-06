import express from 'express';

import { authenticate } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { blogController } from '../controller/blogController';

const blogRouter=express.Router()

/**
 * Public routes
 */
blogRouter.get("/all/blogs", blogController.getAllBlogs);
blogRouter.get("/author/:id", blogController.getBlogsByAuthor);
blogRouter.get("/blogs/:id", blogController.getBlogById);


blogRouter.post("/blogs/:id/comments", authenticate, blogController.addComment);
blogRouter.post("/blogs", authenticate, requireRole("author"), blogController.createBlog);
blogRouter.put("/blogs/:id", authenticate, requireRole("author"), blogController.updateBlog);
blogRouter.delete("/blogs/:id", authenticate, requireRole("author"),blogController.deleteBlog);

export {blogRouter}
