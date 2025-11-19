# Form Backend API

Backend API untuk Dynamic Form Application menggunakan Node.js dan Express.js.

## Instalasi

```bash
npm install
```

## Konfigurasi

1. Copy `.env.example` ke `.env`
2. Edit `.env` sesuai kebutuhan:
   - `PORT`: Port server (default: 3001)
   - `ADMIN_PASSWORD`: Password admin
   - `JWT_SECRET`: Secret key untuk JWT
   - `CORS_ORIGIN`: Origin yang diizinkan untuk CORS
   - `MONGODB_URI`: MongoDB connection string

### Setup MongoDB

**Opsi 1: MongoDB Local**
```bash
# Install MongoDB Community Edition
# Windows: https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB service
# Windows: net start MongoDB
# Mac/Linux: brew services start mongodb-community
# atau: sudo systemctl start mongod
```

**Opsi 2: MongoDB Atlas (Cloud)**
1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru
3. Dapatkan connection string
4. Update `MONGODB_URI` di `.env`

## Menjalankan Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server akan berjalan di `http://localhost:3001`

## API Endpoints

### Form Configuration
- `GET /api/form` - Get form configuration
- `PUT /api/form` - Update form configuration
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

## Authentication

Admin endpoints memerlukan JWT token di header:
```
Authorization: Bearer <token>
```

Token didapatkan dari endpoint `/api/admin/login`.

