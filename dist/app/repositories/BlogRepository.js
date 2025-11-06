"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Blog_1 = require("../models/Blog");
const mongoose_1 = __importDefault(require("mongoose"));
class BlogRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Blog_1.BlogModel);
    }
    // 🔹 Fetch all blogs with optional sort
    async find(filter, options = { sort: { createdAt: -1 } }) {
        return await Blog_1.BlogModel.find(filter)
            .lean()
            .exec();
    }
    // 🔹 Create a new blog
    async create(data) {
        const blog = new Blog_1.BlogModel(data);
        return await blog.save(); // saves to MongoDB
    }
    // 🔹 Fetch blogs by a specific author
    async findByAuthorId(authorId) {
        return await Blog_1.BlogModel.find({
            authorId: new mongoose_1.default.Types.ObjectId(authorId),
        })
            .lean()
            .exec();
    }
    // 🔹 Add a comment to a blog
    async addComment(blogId, comment) {
        const blog = await Blog_1.BlogModel.findById(blogId);
        if (!blog)
            return null;
        if (!blog.comments) {
            blog.comments = [];
        }
        const newComment = {
            ...comment,
            createdAt: new Date(),
        };
        blog.comments.push(newComment);
        await blog.save();
        return blog.toObject();
    }
}
exports.BlogRepository = BlogRepository;
