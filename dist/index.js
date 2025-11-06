"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_1 = require("./app/config/db");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
const authRoutes_1 = require("./app/router/authRoutes");
app.use('/auth', authRoutes_1.authRouter);
const blogRoutes_1 = require("./app/router/blogRoutes");
app.use('/api', blogRoutes_1.blogRouter);
db_1.db.then(() => {
    app.listen(process.env.PORT, () => console.log(`Server is running on port http://localhost:${process.env.PORT}`));
});
