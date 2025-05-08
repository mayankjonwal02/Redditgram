const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits : { type: Number, default: 0 },
  savedContent: [
    {
      subredditid: { type: String, required: true },
      title: { type: String, required: true },
      permalink: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
