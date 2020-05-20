// lib/app.ts
import express from 'express';
import mongoose from 'mongoose';
import * as messageController from 'controllers/messageController'  
// Create a new express application instance
const app: express.Application = express();


//Connect to MongoDB
mongoose.connect('', {useNewUrlParser: true}).then(()=>{
  console.log('Successfully connected to MongoDB');
}).catch((error)=>{
  console.log('Unable to connect to MongoDB');
  console.error(error);
});

//Create Route
var messageRouter = express.Router();
messageRouter.route('/message');

messageRouter.get('/', function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.send('Hello World!');
});
messageRouter.get('/:page', Message);
messageRouter.post('/new', function(req, res) {
  req.statusCode == 400
});

app.use('/api', messageRouter);
export default app;

app.listen(3000, function () {
  console.log('SimpleChat API start on port 3000!');
});