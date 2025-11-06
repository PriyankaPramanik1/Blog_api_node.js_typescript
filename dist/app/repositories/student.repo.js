"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRepositories = void 0;
const student_Model_1 = require("../models/student.Model");
class StudentRepositories {
    //create a post
    async save(data) {
        try {
            const newStudent = await student_Model_1.StudentModel.create(data);
            return newStudent;
        }
        catch (error) {
            console.log(error);
        }
    }
    //all data
    async find() {
        try {
            const studentList = await student_Model_1.StudentModel.find();
            return studentList;
        }
        catch (error) {
            console.log(error);
        }
    }
    //single data
    async singleData(id) {
        try {
            const sdata = await student_Model_1.StudentModel.findById({ _id: id });
            if (!sdata) {
                return 'student not available';
            }
            return sdata;
        }
        catch (error) {
            console.log(error);
        }
    }
    //update a post
    async updatePost(id, data) {
        try {
            //pass the id of the object you want to update
            //data is for the new body you are updating the old one with
            //new:true, so the dats being returned, is the update one
            const student = await student_Model_1.StudentModel.findByIdAndUpdate({ _id: id }, data, { new: true });
            if (!student) {
                return "student not available";
            }
            return student;
        }
        catch (error) {
            console.log(error);
        }
    }
    //delete a post by using the find by id and delete 
    async deletePost(id) {
        try {
            const student = await student_Model_1.StudentModel.findByIdAndDelete(id);
            if (!student) {
                return 'student not available';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
const studentRepositories = new StudentRepositories();
exports.studentRepositories = studentRepositories;
