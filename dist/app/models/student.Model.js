"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = exports.StudentSchemaValidate = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
//validation schema
exports.StudentSchemaValidate = joi_1.default.object({
    name: joi_1.default.string().required().min(3),
    email: joi_1.default.string().required().email(),
    phone: joi_1.default.number().required(),
    address: joi_1.default.string().required(),
});
const StudentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
});
const StudentModel = (0, mongoose_1.model)('student', StudentSchema);
exports.StudentModel = StudentModel;
