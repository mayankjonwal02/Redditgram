const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const registerUser = async (req, res) => {
  try {
    console.log('Registering user:', req.body);
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this username or email already exists', executed: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', executed: true });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error, executed: false });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log('Logging in user:', req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    var ispasswordsame = await bcrypt.compare(password, user.password);
    console.log(ispasswordsame);
    if (!user || !ispasswordsame) {
      return res.status(401).json({ message: 'Invalid credentials', executed: false });
    }

    console.log('User authenticated successfully:', username); // Log username instead of attempting to decrypt password

    const token = jwt.sign({ username, password }, 'your_jwt_secret', { expiresIn: '1d' });
    res.status(200).json({ message: 'User logged in successfully', token, user, executed: true });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error, executed: false });
  }
};

const checkUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided', executed: false });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');

    const user = await User.findOne({ username: decoded.username });
    if (!user || !(await bcrypt.compare(decoded.password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials in token', executed: false });
    }

    console.log('User authenticated successfully:', decoded.username);
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error, executed: false });
  }
};

module.exports = { registerUser, loginUser, checkUser };
