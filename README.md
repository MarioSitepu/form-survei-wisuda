# Dynamic Form Application

Aplikasi form dinamis dengan admin dashboard, menggunakan React + Vite untuk frontend dan Node.js + Express untuk backend.

## Struktur Proyek

```
dynamic-form-application/
├── form-fe/          # Frontend (React + Vite + TypeScript)
│   ├── src/
│   ├── components/
│   ├── lib/
│   └── public/
└── form-be/          # Backend (Node.js + Express)
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── services/
    │   ├── models/      # MongoDB models
    │   ├── config/      # Configuration files
    │   └── middleware/
```

## Quick Start

### Install Semua Dependencies

```bash
npm run install:all
```

Atau install secara manual:

```bash
# Backend
cd form-be
npm install

# Frontend
cd form-fe
npm install --legacy-peer-deps
```

### Setup Environment Variables

**Backend (form-be/.env):**
```env
PORT=3001
NODE_ENV=development
ADMIN_PASSWORD=admin123
JWT_SECRET=b587e1e6a382b53fc9e2444a20088c5b641eb0b5d0e2d0e23ddb2e08c8123e0b30a456272bc8e9d179a8e52e88ff9216a959aac7fce42e15e677679cc577d8fa
CORS_ORIGIN=http://localhost:5173

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/dynamic-form-app
# atau untuk MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dynamic-form-app
```

**Generate JWT Secret baru:**
```bash
cd form-be
npm run generate:jwt-secret
```

**Frontend (form-fe/.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

### Menjalankan Aplikasi

**Opsi 1: Jalankan Bersama (Recommended)**
```bash
npm run dev
```

**Opsi 2: Jalankan Terpisah**

Terminal 1 - Backend:
```bash
cd form-be
npm run dev
```

Terminal 2 - Frontend:
```bash
cd form-fe
npm run dev
```

## URL Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## Teknologi

### Frontend
- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB dengan Mongoose
- JWT Authentication

## API Endpoints

### Form Configuration
- `GET /api/form` - Get form configuration
- `PUT /api/form` - Update form configuration (admin only)
- `POST /api/form/initialize` - Initialize default form config

### Responses
- `GET /api/responses` - Get all responses (admin only)
- `GET /api/responses/:id` - Get response by ID (admin only)
- `POST /api/responses` - Add new response (public)
- `DELETE /api/responses/:id` - Delete response (admin only)

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify admin session

### Health Check
- `GET /api/health` - Check server status

## Default Credentials

- **Admin Password**: `admin123`

## Authentication

Admin endpoints memerlukan JWT token di header:
```
Authorization: Bearer <token>
```

Token didapatkan dari endpoint `/api/admin/login`.

## Data Storage

Data disimpan di MongoDB:
- **Database**: `dynamic-form-app`
- **Collections**:
  - `formconfigs` - Form configuration
  - `responses` - Form responses

### Setup MongoDB

**Opsi 1: MongoDB Local**
1. Install MongoDB Community Edition dari [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. MongoDB akan berjalan di `mongodb://localhost:27017`

**Opsi 2: MongoDB Atlas (Cloud)**
1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru (gratis)
3. Dapatkan connection string
4. Update `MONGODB_URI` di `.env`

## Development Scripts

### Root Directory
- `npm run dev` - Jalankan backend dan frontend bersama
- `npm run install:all` - Install semua dependencies
- `npm run build:fe` - Build frontend untuk production

### Backend (form-be)
- `npm run dev` - Development server dengan watch mode
- `npm start` - Production server

### Frontend (form-fe)
- `npm run dev` - Development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build
