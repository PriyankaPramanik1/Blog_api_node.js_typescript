import mongoose, { Schema } from "mongoose";
import { IBlogDocument, commentInertface } from "../interface/blog.interface";

const CommentSchema = new Schema<commentInertface>(
  {
    authorId: { type: String, ref: "User", required: true },
    authorName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const BlogSchema = new Schema<IBlogDocument>(
  {
    title: { type: String, required: true },
    category:{ type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    authorId: { type: String, ref: "User", required: true },
    authorName: { type: String, required: true },
    comments: { type: [CommentSchema], default: [] }
  },
  { timestamps: true }
);

export const BlogModel = mongoose.model<IBlogDocument>("Blog", BlogSchema);
