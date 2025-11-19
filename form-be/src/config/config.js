import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dynamic-form-app';

