const express = require('express');
const { json } = require('express');
const cors = require('cors');
const connectToMongoDB = require('./services/connectMongoService.js'); // Use require for CommonJS module
const authRouter = require('./controllers/authController.js');
const feedRouter = require('./controllers/feedController.js');
const { checkUser } = require('./services/authService.js');
const { storeAccessToken, retrieveAccessToken } = require("./utils/getAccessToken.js");
const { RedditLogin,canLoginToReddit } = require('./services/feedService.js');

const app = express();
const cors_config = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: false, // Credentials should be false when origin is '*'
};

app.use(cors(cors_config));

const port = 5000;

const startServer = async () => {
  await connectToMongoDB();

  app.use(json());
  app.use('/auth', authRouter);

  // Apply checkUser middleware only for /feed routes
  app.use('/feed', checkUser, feedRouter);

  app.get('/', async (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startServer();
