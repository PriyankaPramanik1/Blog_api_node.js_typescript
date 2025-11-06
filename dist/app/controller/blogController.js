"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const BlogRepository_1 = require("../repositories/BlogRepository");
const mongodb_1 = require("mongodb");
const blogRepo = new BlogRepository_1.BlogRepository();
class BlogController {
    async getAllBlogs(req, res) {
        try {
            const blogs = await blogRepo.find({}, { sort: { createdAt: -1 } });
            return res.json({ blogs });
        }
        catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
    ;
    async getBlogsByAuthor(req, res) {
        try {
            const authorId = req.params.id;
            if (!mongodb_1.ObjectId.isValid(authorId)) {
                return res.status(400).json({ message: "Invalid author ID" });
            }
            const blogs = await blogRepo.findByAuthorId(authorId);
            return res.json({ blogs });
        }
        catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
    ;
    async getBlogById(req, res) {
        try {
            const id = req.params.id;
            const blog = await blogRepo.findById(id);
            if (!blog)
                return res.status(404).json({ message: "Blog not found" });
            return res.json({ blog });
        }
        catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
    ;
    // Author-only: create
    async createBlog(req, res) {
        try {
            const { title, content, category, tags } = req.body;
            if (!req.user)
                return res.status(401).json({ message: "Unauthorized" });
            if (!title || !content)
                return res.status(400).json({ message: "Missing title or content" });
            const blog = blogRepo.create({
                title,
                content,
                category,
                tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
                authorId: req.user.id,
                authorName: req.user.name
            });
            return res.status(201).json({ message: "Blog created", blog });
        }
        catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
    ;
    // Author-only: update
    async updateBlog(req, res) {
        try {
            const id = req.params.id;
            if (!req.user)
                return res.status(401).json({ message: "Unauthorized" });
            const existing = await blogRepo.findById(id);
            if (!existing)
                return res.status(404).json({ message: "Blog not found" });
            if (existing.authorId.toString() !== req.user.id)
                return res.status(403).json({ message: "Forbidden: not the author" });
            const { title, content, tags } = req.body;
            const updated = await blogRepo.update(id, { title, content, tags });
            return res.json({ message: "Blog updated", blog: updated });
        }
        catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
    ;
    // Author-only: delete
    async deleteBlog(req, res) {
        try {
            const id = req.params.id;
            if (!req.user)
                return res.status(401).json({ message: "Unauthorized" });
            const existing = await blogRepo.findById(id);
            if (!existing)
                return res.status(404).json({ message: "Blog not found" });
            if (existing.authorId.toString() !== req.user.id)
                return res.status(403).json({ message: "Forbidden: not the author" });
            await blogRepo.delete(id);
            return res.json({ message: "Blog deleted" });
        }
        catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
    ;
    // Add comment (user must be logged in)
    async addComment(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: "Unauthorized" });
            const blogId = req.params.id;
            const { content } = req.body;
            if (!content)
                return res.status(400).json({ message: "Missing comment content" });
            const updated = await blogRepo.addComment(blogId, { authorId: req.user.id, authorName: req.user.name, content });
            if (!updated)
                return res.status(404).json({ message: "Blog not found" });
            return res.status(201).json({ message: "Comment added", blog: updated });
        }
        catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
    ;
}
exports.blogController = new BlogController();
