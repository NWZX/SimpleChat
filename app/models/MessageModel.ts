import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    username: string;
    message: string;
    date: number;
}

const messageModel: Schema = new mongoose.Schema({
    username: { type: String, require: true },
    message: { type: String, require: true },
    date: { type: Number, require: true }
});

export default mongoose.model<IMessage>('Message', messageModel);