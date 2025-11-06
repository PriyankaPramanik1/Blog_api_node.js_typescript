"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    // Create document
    async save(data) {
        try {
            const newData = await this.model.create(data);
            return newData;
        }
        catch (error) {
            console.log(error);
        }
    }
    // Get all documents
    async findAll() {
        try {
            const list = await this.model.find();
            return list;
        }
        catch (error) {
            console.log(error);
        }
    }
    // Get single document by ID
    async findById(id) {
        try {
            const data = await this.model.findById(id);
            if (!data) {
                return `${this.model.modelName} not found`;
            }
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }
    // Update document
    async update(id, data) {
        try {
            const updated = await this.model.findByIdAndUpdate(id, data, { new: true });
            if (!updated) {
                return `${this.model.modelName} not found`;
            }
            return updated;
        }
        catch (error) {
            console.log(error);
        }
    }
    // Delete document
    async delete(id) {
        try {
            const deleted = await this.model.findByIdAndDelete(id);
            if (!deleted) {
                return `${this.model.modelName} not found`;
            }
            return deleted;
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.BaseRepository = BaseRepository;
