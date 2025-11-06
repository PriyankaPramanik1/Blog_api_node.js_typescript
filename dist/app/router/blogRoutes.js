"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const blogController_1 = require("../controller/blogController");
const blogRouter = express_1.default.Router();
exports.blogRouter = blogRouter;
/**
 * Public routes
 */
blogRouter.get("/all/blogs", blogController_1.blogController.getAllBlogs);
blogRouter.get("/author/:id", blogController_1.blogController.getBlogsByAuthor);
blogRouter.get("/blogs/:id", blogController_1.blogController.getBlogById);
blogRouter.post("/blogs/:id/comments", authMiddleware_1.authenticate, blogController_1.blogController.addComment);
blogRouter.post("/blogs", authMiddleware_1.authenticate, (0, roleMiddleware_1.requireRole)("author"), blogController_1.blogController.createBlog);
blogRouter.put("/blogs/:id", authMiddleware_1.authenticate, (0, roleMiddleware_1.requireRole)("author"), blogController_1.blogController.updateBlog);
blogRouter.delete("/blogs/:id", authMiddleware_1.authenticate, (0, roleMiddleware_1.requireRole)("author"), blogController_1.blogController.deleteBlog);
