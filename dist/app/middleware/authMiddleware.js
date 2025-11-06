"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "MyS3cr3tK3Yforemost345";
// ✅ Define authenticate as a RequestHandler so Express accepts it
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing or invalid auth token" });
        }
        const token = authHeader.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // ✅ Fetch user safely
        const user = await User_1.UserModel.findById(payload.id).lean().exec();
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        // ✅ Ensure all fields are string (no undefined)
        req.user = {
            id: user._id.toString(),
            role: user.role || "user", // default if missing
            name: user.name || "",
            email: user.email || "",
        };
        next();
    }
    catch (err) {
        return res
            .status(401)
            .json({ message: "Unauthorized", error: err.message });
    }
};
exports.authenticate = authenticate;
