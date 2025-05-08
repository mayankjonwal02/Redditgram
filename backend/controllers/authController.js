const express = require('express');
const { registerUser, loginUser, checkUser } = require('../services/authService');

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/authenticate', checkUser);

module.exports = authRouter;
