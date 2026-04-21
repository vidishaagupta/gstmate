import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gstmate';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};
