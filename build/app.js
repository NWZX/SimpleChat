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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var messageController = __importStar(require("./controllers/MessageController"));
// Create a new express application instance
var app = express_1.default();
//Connect to MongoDB
mongoose_1.default.connect('mongodb://localhost:27018/', { useNewUrlParser: true }).then(function () {
    console.log('Successfully connected to MongoDB');
}).catch(function (error) {
    console.log('Unable to connect to MongoDB');
    console.error(error);
});
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(body_parser_1.default.json());
//Create Route
app.use('/', express_1.default.static(__dirname + '/public'));
app.route('/message').get(messageController.getAllMessage);
app.get("/message/last/:time", messageController.getMessagesLast);
app.route("/message/new").post(messageController.setMessage);
//messageRouter.get('/:page', messageController.default.getMessagesInPage);
app.listen(3000, function () {
    console.log('SimpleChat API start on port 3000!');
});
exports.default = app;
