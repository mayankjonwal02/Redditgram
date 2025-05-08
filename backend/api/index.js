const express = require('express');
const { json } = require('express');
const cors = require('cors');
const connectToMongoDB = require('../services/connectMongoService.js');
const authRouter = require('../controllers/authController.js');
const feedRouter = require('../controllers/feedController.js');
const { checkUser } = require('../services/authService.js');

const app = express();
const cors_config = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false,
};

app.use(cors(cors_config));
app.use(json());

let isDbConnected = false;

app.use('/auth', authRouter);
app.use('/feed', checkUser, feedRouter);
app.get('/', async (req, res) => {
  res.send('Hello World!');
});

module.exports = async (req, res) => {
  if (!isDbConnected) {
    await connectToMongoDB();
    isDbConnected = true;
  }
  return app(req, res); // Express handler as serverless function
};
