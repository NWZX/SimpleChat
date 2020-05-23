"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMessage = exports.getMessagesLast = exports.getAllMessage = void 0;
var Message = __importStar(require("../models/MessageModel"));
var ms = Message.default;
exports.getAllMessage = function (req, res) {
    ms.find().then(function (message) {
        if (!message || message.length <= 0) {
            res.status(404).send(new Error('No message'));
        }
        res.status(200).json(message);
    }).catch(function () {
        res.status(500).send(new Error('DB error'));
    });
};
exports.getMessagesLast = function (req, res) {
    var time = parseInt(req.param("time"), 10);
    ms.find({ date: { $gte: time } }).then(function (message) {
        if (!message || message.length <= 0) {
            res.status(404).send(new Error('No message'));
        }
        message.shift();
        res.status(200).json(message);
    }).catch(function () {
        res.status(500).send(new Error('DB error'));
    });
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
exports.setMessage = function (req, res) {
    if (!req.body || !req.body.username || !req.body.message) {
        return res.status(400).send(new Error('Bad request!'));
    }
    if (req.body.username.length <= 20) {
        var msg = {
            username: req.body.username,
            message: req.body.message,
            date: new Date().getTime()
        };
        ms.create(msg, function (err, result) {
            res.send(err);
        });
        res.status(200);
    }
    else {
        return res.status(400).send(new Error('Bad request!'));
    }
};
