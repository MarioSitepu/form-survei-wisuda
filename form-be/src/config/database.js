import mongoose from 'mongoose';
import { MONGODB_URI } from './config.js';

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000; // 3 seconds

export const connectDB = async (retries = MAX_RETRIES) => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (retries > 0) {
      console.warn(`⚠️  MongoDB connection failed. Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      console.warn(`   Error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retries - 1);
    } else {
      console.error(`❌ Error connecting to MongoDB after ${MAX_RETRIES} attempts: ${error.message}`);
      console.error(`💡 Please ensure MongoDB is running at ${MONGODB_URI}`);
      console.error(`💡 Server will continue running but database operations will fail.`);
      // Don't exit - let server start anyway
      return null;
    }
  }
};

export default connectDB;

