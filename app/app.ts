// lib/app.ts
import http from 'http';
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as messageController from './controllers/MessageController';

// Create a new express application instance
const app: express.Application = express();


//Connect to MongoDB
mongoose.connect('mongodb://localhost:27018/', { useNewUrlParser: true }).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((error) => {
  console.log('Unable to connect to MongoDB');
  console.error(error);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json())
//Create Route
app.use('/', express.static(__dirname + '/public'));
app.route('/message').get(messageController.getAllMessage);
app.get("/message/last/:time", messageController.getMessagesLast);
app.route("/message/new").post(messageController.setMessage)
//messageRouter.get('/:page', messageController.default.getMessagesInPage);

app.listen(3000, function () {
  console.log('SimpleChat API start on port 3000!');
})
export default app;