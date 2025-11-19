import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
export const JWT_SECRET = process.env.JWT_SECRET || 'b587e1e6a382b53fc9e2444a20088c5b641eb0b5d0e2d0e23ddb2e08c8123e0b30a456272bc8e9d179a8e52e88ff9216a959aac7fce42e15e677679cc577d8fa';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dynamic-form-app';

