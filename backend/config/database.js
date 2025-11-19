/**
 * Database Configuration
 * Connects to MongoDB using Mongoose
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB with recommended options
    console.log("🔍 MONGODB_URI from .env:", process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options help with stability
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
