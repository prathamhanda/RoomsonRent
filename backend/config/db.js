const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB connection URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
    console.log("Database connection successful!".green.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    console.error("Full error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
