"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repositories/UserRepository");
const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d");
class AuthController {
    async register(req, res) {
        try {
            const result = await UserRepository_1.userRepository.register(req.body);
            if ("error" in result) {
                return res.status(400).json({ message: result.error });
            }
            res.status(201).json({ message: "User registered successfully", user: result });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }
    ;
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await UserRepository_1.userRepository.login(email, password);
            if ("error" in result) {
                return res.status(401).json({ message: result.error });
            }
            const token = jsonwebtoken_1.default.sign({ id: result._id.toString(), role: result.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } // 👈 type-safe cast
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
        }
        catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }
    ;
}
exports.authController = new AuthController();
