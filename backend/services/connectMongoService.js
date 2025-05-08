const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connectToMongoDB() {
    const fullUri = process.env.MONGO_URI;

    try {
        await mongoose.connect(fullUri);
        console.log('Connected to MongoDB successfully using Mongoose');
    } catch (error) {
        console.error('Error connecting to MongoDB with Mongoose:', error);
        throw error;
    }
}

module.exports = connectToMongoDB;
