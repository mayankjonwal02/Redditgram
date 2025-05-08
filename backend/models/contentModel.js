const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  subredditid: { type: String, required: true },
  title: { type: String, required: true },
  permalink : { type: String, required: true },
});

module.exports = mongoose.model('Content', contentSchema);
