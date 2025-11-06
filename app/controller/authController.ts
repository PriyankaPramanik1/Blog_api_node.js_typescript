import { Request, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { userRepository } from "../repositories/UserRepository";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "secret123";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") 

class AuthController {
async register(req: Request, res: Response){
  try {
    const result = await userRepository.register(req.body);

    if ("error" in result) {
      return res.status(400).json({ message: result.error });
    }

    res.status(201).json({ message: "User registered successfully", user: result });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};
async login(req: Request, res: Response){
  try {
    const { email, password } = req.body;
    const result = await userRepository.login(email, password);

    if ("error" in result) {
      return res.status(401).json({ message: result.error });
    }

    const token = jwt.sign(
      { id: result._id.toString(), role: result.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions // 👈 type-safe cast
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};
}
export const authController = new AuthController();