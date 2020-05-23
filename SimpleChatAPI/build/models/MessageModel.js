"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var messageModel = new mongoose_1.default.Schema({
    username: { type: String, require: true },
    message: { type: String, require: true },
    date: { type: Number, require: true }
});
exports.default = mongoose_1.default.model('Message', messageModel);
