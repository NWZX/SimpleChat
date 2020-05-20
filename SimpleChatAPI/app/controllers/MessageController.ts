import * as Message from '../models/MessageModel';
const ms = Message.default;

exports.getAllMessage = (req:any, res:any) => {
    ms.find().then(
        (message:any) => {
            res.status(200).json(message.map());
        }
    )
}
exports.getMessagesInPage = (req:any, res:any) => {
    res.par
    ms.find().sort({date:-1}).skip(0).limit(100)
    ms.find().then(
        (message:any) => {
            res.status(200).json(message.map());
        }
    )
}
