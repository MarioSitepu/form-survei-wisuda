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
    │   └── middleware/
    └── data/         # JSON storage files
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
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:5173
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
- JWT Authentication
- File-based storage (JSON)

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

Data disimpan dalam file JSON di `form-be/data/`:
- `form-config.json` - Form configuration
- `responses.json` - Form responses

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
