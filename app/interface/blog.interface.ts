import { commentInertface } from "./comment.interface";

export interface BlogInterface {
  title: string;
  content: string;
  category?: string
  tags?: string[];
  authorId: string;
  authorName: string;
  createdAt?: Date;
  updatedAt?: Date;
  comments?: commentInertface[];
}

export interface IBlogDocument extends BlogInterface {}

export { commentInertface };
