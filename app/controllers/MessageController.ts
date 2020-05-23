import express, { Router } from 'express';
import * as Message from '../models/MessageModel';
import { userInfo } from 'os';
const ms = Message.default;

export const getAllMessage = (req: express.Request, res: express.Response) => {
    ms.find().then(
        (message: any) => {
            if (!message || message.length <= 0) {
                res.status(404).send(new Error('No message'));
            }
            res.status(200).json(message);
        }
    ).catch(
        () => {
            res.status(500).send(new Error('DB error'));
        }
    );
};
export const getMessagesLast = (req: express.Request, res: express.Response) => {
    let time: number = parseInt(req.param("time"), 10);
    ms.find({ date: { $gte: time } }).then(
        (message: any) => {
            if (!message || message.length <= 0) {
                res.status(404).send(new Error('No message'));
            }
            message.shift();
            res.status(200).json(message);
        }
    ).catch(
        () => {
            res.status(500).send(new Error('DB error'));
        }
    );
};

/*controller.getMessagesInPage = (req: Request, res: any) => {
    let messageScale = (req.params.page - 1) * 100
    ms.find().count().then(
        (number) => {
            if (number > messageScale) {
                ms.find().sort({ date: -1 }).skip(messageScale).limit(100).then(
                    (message: any) => {
                        res.status(200).json(message.map());
                    }
                );
            }
            else {
                res.status(404).error(new Error('No message'));
            }
        }
    ).catch(
        () => {
            res.status(500).send(new Error('DB error'));
        }
    );
};*/

export const setMessage = (req: express.Request, res: express.Response) => {
    if (!req.body || !req.body.username || !req.body.message) {
        return res.status(400).send(new Error('Bad request!'));
    }
    if (req.body.username.length <= 20) {
        let msg = {
            username: req.body.username,
            message: req.body.message,
            date: new Date().getTime()
        };
        ms.create(msg, function (err: any, result: Message.IMessage[]) {
            res.send(err);
        });
        res.status(200);
    }
    else {
        return res.status(400).send(new Error('Bad request!'));
    }
}