"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentController = void 0;
const student_Model_1 = require("../models/student.Model");
const student_repo_1 = require("../repositories/student.repo");
const lodash_1 = __importDefault(require("lodash"));
class StudentController {
    async createStudent(req, res) {
        try {
            const data = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            };
            const { error, value } = student_Model_1.StudentSchemaValidate.validate(data);
            if (error) {
                return res.send(error.message);
            }
            else {
                //call the create post function in the service and pass the data from the request
                const studentdata = await student_repo_1.studentRepositories.save(value);
                if (lodash_1.default.isObject(studentdata) && studentdata._id) {
                    return res.status(200).send({
                        message: "data created successfully",
                        data: studentdata,
                    });
                }
                else {
                    return res.status(400).send({
                        message: "Failed to create new user",
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getStudent(req, res) {
        try {
            const studentdata = await student_repo_1.studentRepositories.find();
            // const student = _.sortBy(studentdata, ['name'])
            if (lodash_1.default.isObject(studentdata)) {
                return res.status(200).send({
                    message: "data get successfully",
                    data: studentdata,
                });
            }
            else {
                return res.status(400).send({
                    message: "Failed to create new user",
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
// Logic to create a student
exports.studentController = new StudentController();
