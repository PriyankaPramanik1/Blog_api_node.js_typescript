export type Role = "user" | "author";

export interface userInertface {
  _id?: string;
  name: string;
  email: string;
  password: string; // hashed
  role?: string;
}