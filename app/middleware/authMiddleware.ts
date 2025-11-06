import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../models/User";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "MyS3cr3tK3Yforemost345";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    name: string;
    email: string;
  };
}

// ✅ Define authenticate as a RequestHandler so Express accepts it
export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid auth token" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };

    // ✅ Fetch user safely
    const user = await UserModel.findById(payload.id).lean().exec();
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Ensure all fields are string (no undefined)
    (req as AuthRequest).user = {
      id: user._id.toString(),
      role: user.role || "user", // default if missing
      name: user.name || "",
      email: user.email || "",
    };

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: (err as Error).message });
  }
};
