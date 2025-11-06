"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserRepository {
    // ✅ Register user (default role = "user")
    async register(data) {
        try {
            // Check if user already exists
            const existingUser = await User_1.UserModel.findOne({ email: data.email });
            if (existingUser) {
                return { error: "Email already in use" };
            }
            // Hash password
            const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
            // Create new user
            const newUser = await User_1.UserModel.create({
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role || "user", // default role
            });
            return newUser;
        }
        catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    }
    // ✅ Login user
    async login(email, password) {
        try {
            const user = await User_1.UserModel.findOne({ email });
            if (!user) {
                return { error: "Invalid email or password" };
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                return { error: "Invalid email or password" };
            }
            return user;
        }
        catch (error) {
            console.error("Error logging in user:", error);
            throw error;
        }
    }
    // ✅ Find user by email
    async findByEmail(email) {
        try {
            return await User_1.UserModel.findOne({ email }).exec();
        }
        catch (error) {
            console.error("Error finding user by email:", error);
            throw error;
        }
    }
    // ✅ Optional - get all users
    async findAll() {
        try {
            return await User_1.UserModel.find();
        }
        catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }
}
exports.UserRepository = UserRepository;
// ✅ Export a single instance
exports.userRepository = new UserRepository();
