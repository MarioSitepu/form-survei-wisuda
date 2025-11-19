# 🚀 Dynamic Form Application

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.20.0-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.0-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.9-38B2AC?logo=tailwind-css&logoColor=white)

**Aplikasi form dinamis dengan admin dashboard lengkap, dibangun dengan teknologi modern full-stack**

[Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Architecture](#-architecture)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Dynamic Form Application** adalah aplikasi web full-stack yang memungkinkan Anda membuat dan mengelola form dinamis dengan mudah. Aplikasi ini dilengkapi dengan admin dashboard yang powerful untuk mengelola form, melihat responses, dan menganalisis data.

### ✨ Key Highlights

- 🎨 **Dynamic Form Builder** - Buat form dengan berbagai tipe field tanpa coding
- 📊 **Multi-Form Management** - Kelola multiple forms dengan primary form system
- 🔐 **Secure Admin Panel** - JWT-based authentication untuk keamanan
- 📈 **Analytics Dashboard** - Visualisasi data responses dengan charts
- 🎭 **Dark Mode Support** - Tema gelap/terang yang dapat disesuaikan
- 📱 **Responsive Design** - Optimal di semua perangkat
- ⚡ **Fast & Modern** - Built dengan React 19 dan Vite untuk performa optimal

---

## ✨ Features

### 🎨 Form Management
- ✅ **7 Tipe Field**: Text, Email, Number, Textarea, Select, Checkbox, Radio
- ✅ **Dynamic Form Builder** - Drag & drop field editor
- ✅ **Multi-Form Support** - Buat dan kelola multiple forms
- ✅ **Primary Form System** - Set form utama yang ditampilkan di home
- ✅ **Archive System** - Archive/unarchive forms
- ✅ **Form Validation** - Client-side validation dengan error handling
- ✅ **Data Cleaning** - Automatic data normalization

### 👨‍💼 Admin Dashboard
- ✅ **Form Editor** - Visual editor untuk membuat dan mengedit form
- ✅ **Form Management** - Create, edit, delete, set primary, archive forms
- ✅ **Responses Table** - View semua responses dengan filtering
- ✅ **Analytics Dashboard** - Statistics dan charts untuk data analysis
- ✅ **Users List** - Extract dan view user emails dari responses
- ✅ **Session Management** - Secure JWT-based authentication

### 🔒 Security
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Session Management** - Active session tracking
- ✅ **Protected Routes** - Admin-only endpoints
- ✅ **CORS Configuration** - Secure cross-origin requests
- ✅ **Input Validation** - Server-side validation

### 🎨 User Experience
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark/Light Mode** - System theme detection
- ✅ **Loading States** - Smooth loading indicators
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Success Feedback** - Clear confirmation messages

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **TypeScript** | 5.0 | Type Safety |
| **Vite** | 5.4.0 | Build Tool & Dev Server |
| **React Router** | 6.28.0 | Client-side Routing |
| **TailwindCSS** | 4.1.9 | Utility-first CSS |
| **Shadcn UI** | Latest | Component Library (50+ components) |
| **Recharts** | Latest | Data Visualization |
| **React Hook Form** | 7.60.0 | Form Management |
| **Zod** | 3.25.76 | Schema Validation |
| **next-themes** | 0.4.6 | Theme Management |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime Environment |
| **Express** | 4.18.2 | Web Framework |
| **MongoDB** | Latest | NoSQL Database |
| **Mongoose** | 8.20.0 | ODM (Object Data Modeling) |
| **JWT** | 9.0.2 | Authentication |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 16.3.1 | Environment Variables |

---

## 📁 Project Structure

```
dynamic-form-application/
├── 📂 form-fe/                    # Frontend Application
│   ├── 📂 src/
│   │   ├── 📂 pages/              # Route Pages
│   │   │   ├── Home.tsx           # Home page dengan dynamic form
│   │   │   ├── AdminPage.tsx      # Admin dashboard page
│   │   │   ├── AdminLink.tsx      # Admin link redirect
│   │   │   └── SuccessPage.tsx    # Success confirmation page
│   │   ├── 📂 components/         # React Components
│   │   │   ├── dynamic-form.tsx   # Dynamic form renderer
│   │   │   ├── admin-dashboard.tsx # Admin dashboard container
│   │   │   ├── admin-login.tsx    # Admin login form
│   │   │   ├── form-editor.tsx    # Form field editor
│   │   │   ├── form-management.tsx # Form management panel
│   │   │   ├── responses-table.tsx # Responses data table
│   │   │   ├── responses-analytics.tsx # Analytics dashboard
│   │   │   ├── users-list.tsx     # Users list component
│   │   │   ├── theme-provider.tsx # Theme context provider
│   │   │   └── 📂 ui/             # Shadcn UI components (50+)
│   │   ├── 📂 services/           # API Services
│   │   │   └── api.ts             # API client dengan JWT
│   │   ├── 📂 lib/                # Utilities & Helpers
│   │   │   ├── storage.ts         # Storage utilities
│   │   │   ├── auth.ts            # Authentication utilities
│   │   │   └── utils.ts           # General utilities
│   │   ├── 📂 hooks/              # Custom React Hooks
│   │   ├── App.tsx                # Main app component
│   │   └── main.tsx               # Entry point
│   ├── 📂 public/                 # Static Assets
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── 📂 form-be/                    # Backend API
│   ├── 📂 src/
│   │   ├── 📂 routes/             # API Routes
│   │   │   ├── form.routes.js     # Form endpoints
│   │   │   ├── response.routes.js # Response endpoints
│   │   │   └── admin.routes.js    # Admin endpoints
│   │   ├── 📂 controllers/        # Business Logic
│   │   │   ├── form.controller.js # Form operations
│   │   │   ├── response.controller.js # Response operations
│   │   │   └── admin.controller.js # Admin operations
│   │   ├── 📂 services/           # Data Access Layer
│   │   │   └── storage.service.js # MongoDB operations
│   │   ├── 📂 models/             # MongoDB Models
│   │   │   ├── FormConfig.model.js # Form schema
│   │   │   └── Response.model.js  # Response schema
│   │   ├── 📂 middleware/         # Express Middleware
│   │   │   └── auth.middleware.js # JWT authentication
│   │   ├── 📂 config/             # Configuration
│   │   │   ├── config.js          # Environment config
│   │   │   └── database.js        # MongoDB connection
│   │   ├── 📂 scripts/            # Utility Scripts
│   │   │   └── generate-jwt-secret.js # JWT secret generator
│   │   └── server.js              # Express server
│   ├── package.json
│   └── .env.example
│
├── 📄 FLOWCHART.md                # Flowchart dokumentasi
├── 📄 README-FLOWCHART-PROSES-PENGEMBANGAN.md # Development guide
├── 📄 README.md                   # This file
├── 📄 LICENSE                     # License file
└── package.json                   # Root package (concurrently)
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ dan npm
- **MongoDB** (Local atau Atlas)
- **Git** (optional)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd dynamic-form-application
```

### Step 2: Install Dependencies

**Opsi 1: Install Semua (Recommended)**
```bash
npm run install:all
```

**Opsi 2: Install Manual**

Backend:
```bash
cd form-be
npm install
```

Frontend:
```bash
cd form-fe
npm install --legacy-peer-deps
```

### Step 3: Setup Environment Variables

#### Backend Configuration (`form-be/.env`)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Authentication
ADMIN_PASSWORD=admin123
JWT_SECRET=<generate-with-script-below>

# CORS
CORS_ORIGIN=http://localhost:5173

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/dynamic-form-app
# Untuk MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dynamic-form-app
```

**Generate JWT Secret:**
```bash
cd form-be
npm run generate:jwt-secret
```

#### Frontend Configuration (`form-fe/.env`)

```env
VITE_API_URL=http://localhost:3001/api
```

### Step 4: Setup MongoDB

**Opsi 1: MongoDB Local**

1. Install MongoDB Community Edition dari [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

**Opsi 2: MongoDB Atlas (Cloud)**

1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru (Free tier available)
3. Dapatkan connection string
4. Update `MONGODB_URI` di `.env`

---

## ⚙️ Configuration

### Environment Variables

#### Backend (`form-be/.env`)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3001` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `ADMIN_PASSWORD` | Admin login password | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |

#### Frontend (`form-fe/.env`)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` | No |

---

## 🎮 Usage

### Development Mode

**Jalankan Frontend & Backend Bersama (Recommended):**
```bash
npm run dev
```

**Jalankan Terpisah:**

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

### Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health
- **Admin Panel**: http://localhost:5173/admin-7x8k9m2q

### Default Credentials

- **Admin Password**: `admin123`

> ⚠️ **Security Note**: Ganti password default di production!

---

## 📚 API Reference

### Base URL
```
http://localhost:3001/api
```

### Authentication

Admin endpoints memerlukan JWT token di header:
```
Authorization: Bearer <token>
```

Token didapatkan dari `/api/admin/login`.

---

### Form Endpoints

#### Get Primary Form (Public)
```http
GET /api/form/primary
```

**Response:**
```json
{
  "id": "default-form",
  "title": "Customer Feedback Form",
  "description": "Please share your feedback",
  "fields": [...],
  "isPrimary": true,
  "isArchived": false,
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

#### Get Form Config (Public, Backward Compatibility)
```http
GET /api/form
```
Returns primary form (same as `/primary`).

#### Get All Forms (Admin)
```http
GET /api/form/all
Authorization: Bearer <token>
```

#### Get Form by ID (Admin)
```http
GET /api/form/:id
Authorization: Bearer <token>
```

#### Create New Form (Admin)
```http
POST /api/form/new
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Form",
  "description": "Form description",
  "fields": [
    {
      "id": "field1",
      "name": "name",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your name"
    }
  ],
  "isPrimary": false
}
```

#### Update Form (Admin)
```http
PUT /api/form/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Form",
  "description": "Updated description",
  "fields": [...]
}
```

#### Set Form as Primary (Admin)
```http
PUT /api/form/:id/set-primary
Authorization: Bearer <token>
```

#### Archive Form (Admin)
```http
PUT /api/form/:id/archive
Authorization: Bearer <token>
Content-Type: application/json

{
  "isArchived": true
}
```

#### Delete Form (Admin)
```http
DELETE /api/form/:id
Authorization: Bearer <token>
```

#### Initialize Default Form (Public)
```http
POST /api/form/initialize
```

---

### Response Endpoints

#### Get All Responses (Admin)
```http
GET /api/responses
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "response_id",
    "formId": "default-form",
    "data": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "email": "john@example.com",
    "submittedAt": 1234567890
  }
]
```

#### Get Response by ID (Admin)
```http
GET /api/responses/:id
Authorization: Bearer <token>
```

#### Submit Response (Public)
```http
POST /api/responses
Content-Type: application/json

{
  "formId": "default-form",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "feedback": "Great service!"
  },
  "email": "john@example.com"
}
```

#### Delete Response (Admin)
```http
DELETE /api/responses/:id
Authorization: Bearer <token>
```

---

### Admin Endpoints

#### Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d"
}
```

#### Logout
```http
POST /api/admin/logout
Authorization: Bearer <token>
```

#### Verify Session
```http
GET /api/admin/verify
Authorization: Bearer <token>
```

---

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────┐
│   Client Browser│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │
│  (Port 5173)    │
│  - Pages        │
│  - Components   │
│  - Services     │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│ Express Backend │
│  (Port 3001)    │
│  - Routes       │
│  - Controllers  │
│  - Middleware   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│  - FormConfigs  │
│  - Responses    │
└─────────────────┘
```

### Data Flow

1. **User Flow**: Home → Load Primary Form → Fill Form → Validate → Submit → Success
2. **Admin Flow**: Login → Dashboard → Manage Forms/View Responses → Logout
3. **Form Management**: Create/Edit → Set Primary → Archive/Delete
4. **Response Management**: View → Filter → Delete → Analytics

---

## 💻 Development

### Available Scripts

#### Root Directory
```bash
npm run dev          # Run frontend & backend together
npm run install:all  # Install all dependencies
npm run build:fe     # Build frontend for production
```

#### Backend (`form-be/`)
```bash
npm run dev          # Development server with watch mode
npm start            # Production server
npm run generate:jwt-secret  # Generate new JWT secret
```

#### Frontend (`form-fe/`)
```bash
npm run dev          # Development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Guidelines

1. **Code Style**: Follow TypeScript/JavaScript best practices
2. **Commits**: Use conventional commit messages
3. **Testing**: Test all features before committing
4. **Documentation**: Update docs when adding features

### Project Structure Guidelines

- **Components**: Reusable UI components in `components/`
- **Pages**: Route pages in `pages/`
- **Services**: API calls in `services/`
- **Utils**: Helper functions in `lib/`
- **Types**: TypeScript types in component files or `types/`

---

## 🚢 Deployment

### Frontend Deployment

#### Build for Production
```bash
cd form-fe
npm run build
```

Output: `dist/` folder dengan optimized production build.

#### Deploy Options

**Vercel (Recommended):**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

**Netlify:**
1. Drag & drop `dist/` folder
2. Configure redirects for SPA routing

**VPS with Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/dynamic-form/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Backend Deployment

#### Production Environment Variables
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=https://your-frontend-domain.com
JWT_SECRET=<strong-production-secret>
ADMIN_PASSWORD=<strong-password>
```

#### Deploy with PM2
```bash
npm install -g pm2
pm2 start src/server.js --name dynamic-form-api
pm2 save
pm2 startup
```

#### Deploy Options

- **Heroku**: Connect GitHub, auto-deploy
- **Railway**: Simple deployment with MongoDB
- **DigitalOcean**: VPS with PM2
- **AWS EC2**: Full control deployment

---

## 📖 Documentation

### Additional Documentation

- **[FLOWCHART.md](./FLOWCHART.md)** - Flowchart dan diagram arsitektur sistem
- **[README-FLOWCHART-PROSES-PENGEMBANGAN.md](./README-FLOWCHART-PROSES-PENGEMBANGAN.md)** - Panduan lengkap proses pengembangan

### Key Concepts

#### Form Configuration
Form configuration disimpan di MongoDB dengan struktur:
- `id`: Unique identifier
- `title`: Form title
- `description`: Form description
- `fields`: Array of field objects
- `isPrimary`: Boolean untuk form utama
- `isArchived`: Boolean untuk archived forms

#### Field Types
Supported field types:
- `text`: Single line text input
- `email`: Email input dengan validation
- `number`: Numeric input
- `textarea`: Multi-line text input
- `select`: Dropdown selection
- `checkbox`: Multiple selection
- `radio`: Single selection

#### Primary Form System
- Hanya satu form yang bisa `isPrimary: true`
- Primary form ditampilkan di home page
- Setting form as primary akan unset form lain
- Primary form otomatis unarchive jika di-archive

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Write clear commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - Amazing UI framework
- **Vite Team** - Fast build tool
- **Shadcn UI** - Beautiful component library
- **MongoDB** - Flexible database
- **Express** - Robust web framework

---

## 📞 Support

Jika Anda memiliki pertanyaan atau butuh bantuan:

1. Check [Documentation](./README-FLOWCHART-PROSES-PENGEMBANGAN.md)
2. Open an [Issue](../../issues)
3. Contact maintainers

---

<div align="center">

**Made with ❤️ using React, Node.js, and MongoDB**

⭐ Star this repo if you find it helpful!

</div>
