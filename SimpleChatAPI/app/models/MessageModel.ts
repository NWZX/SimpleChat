import mongoose from 'mongoose';

const messageModel = new mongoose.Schema({
    username: { type: String, require: true },
    message: { type: String, require: true },
    date: { type: Number, require: true }
});

export default mongoose.model('Message', messageModel);