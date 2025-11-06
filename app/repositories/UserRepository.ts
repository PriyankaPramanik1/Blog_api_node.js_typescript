import { UserModel } from "../models/User";
import { userInertface } from "../interface/user.interface";
import bcrypt from "bcrypt";

export class UserRepository {
  // ✅ Register user (default role = "user")
  async register(data: { name: string; email: string; password: string; role?: string }) {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: data.email });
      if (existingUser) {
        return { error: "Email already in use" };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create new user
      const newUser = await UserModel.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || "user", // default role
      });

      return newUser;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  // ✅ Login user
  async login(email: string, password: string) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return { error: "Invalid email or password" };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { error: "Invalid email or password" };
      }

      return user;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  // ✅ Find user by email
  async findByEmail(email: string) {
    try {
      return await UserModel.findOne({ email }).exec();
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  // ✅ Optional - get all users
  async findAll() {
    try {
      return await UserModel.find();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}

// ✅ Export a single instance
export const userRepository = new UserRepository();
