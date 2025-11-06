import { BaseRepository } from "./BaseRepository";
import { BlogModel } from "../models/Blog";
import { BlogInterface } from "../interface/blog.interface";
import { commentInertface } from "../interface/comment.interface";
import mongoose from "mongoose";

export class BlogRepository extends BaseRepository<BlogInterface> {
  constructor() {
    super(BlogModel);
  }

  // 🔹 Fetch all blogs with optional sort
  async find(filter: {}, options: { sort: { createdAt: number } } = { sort: { createdAt: -1 } }) {
    return await BlogModel.find(filter)
      .lean()
      .exec();
  }

  // 🔹 Create a new blog
  async create(data: {
    title: string;
    content: string;
    category?: string;
    tags: string[];
    authorId: string;
    authorName: string;
  }) {
    const blog = new BlogModel(data);
    return await blog.save(); // saves to MongoDB
  }

  // 🔹 Fetch blogs by a specific author
  async findByAuthorId(authorId: string) {
    return await BlogModel.find({
      authorId: new mongoose.Types.ObjectId(authorId),
    })
      .lean()
      .exec();
  }

  // 🔹 Add a comment to a blog
  async addComment(
    blogId: string,
    comment: Omit<commentInertface, "createdAt">
  ) {
    const blog = await BlogModel.findById(blogId);
    if (!blog) return null;

    if (!blog.comments) {
      blog.comments = [];
    }

    const newComment: commentInertface = {
      ...comment,
      createdAt: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    return blog.toObject();
  }
}
