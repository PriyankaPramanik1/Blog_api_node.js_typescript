import { Request, Response } from "express";
import { BlogRepository } from "../repositories/BlogRepository";
import { AuthRequest } from "../middleware/authMiddleware";
import { ObjectId } from "mongodb";

const blogRepo = new BlogRepository();
class BlogController{
async getAllBlogs(req: Request, res: Response){
  try {
    const blogs = await blogRepo.find({}, { sort: { createdAt: -1 } });
    return res.json({ blogs });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

async getBlogsByAuthor(req: Request, res: Response){
  try {
      const authorId = req.params.id;

      if (!ObjectId.isValid(authorId)) {
        return res.status(400).json({ message: "Invalid author ID" });
      }

      const blogs = await blogRepo.findByAuthorId(authorId);
      return res.json({ blogs });
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: (err as Error).message });
    }
};

async getBlogById(req: Request, res: Response){
  try {
    const id = req.params.id;
    const blog = await blogRepo.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    return res.json({ blog });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

// Author-only: create
async createBlog(req: AuthRequest, res: Response){
  try {
    const { title, content,category, tags } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !content) return res.status(400).json({ message: "Missing title or content" });

    const blog = blogRepo.create({
      title,
      content,
      category,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      authorId: req.user.id,
      authorName: req.user.name
    });
    return res.status(201).json({ message: "Blog created", blog });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

// Author-only: update
async updateBlog(req: AuthRequest, res: Response){
  try {
    const id = req.params.id;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const existing = await blogRepo.findById(id);
    if (!existing) return res.status(404).json({ message: "Blog not found" });
    if (existing.authorId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden: not the author" });

    const { title, content, tags } = req.body;
    const updated = await blogRepo.update(id, { title, content, tags });
    return res.json({ message: "Blog updated", blog: updated });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

// Author-only: delete
async deleteBlog(req: AuthRequest, res: Response){
  try {
    const id = req.params.id;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const existing = await blogRepo.findById(id);
    if (!existing) return res.status(404).json({ message: "Blog not found" });
    if (existing.authorId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden: not the author" });

    await blogRepo.delete(id);
    return res.json({ message: "Blog deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

// Add comment (user must be logged in)
async addComment(req: AuthRequest, res: Response){
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const blogId = req.params.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Missing comment content" });

    const updated = await blogRepo.addComment(blogId, { authorId: req.user.id, authorName: req.user.name, content });
    if (!updated) return res.status(404).json({ message: "Blog not found" });
    return res.status(201).json({ message: "Comment added", blog: updated });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};
}
export const blogController = new BlogController();