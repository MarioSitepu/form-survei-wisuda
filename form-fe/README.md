# Form Frontend

Frontend aplikasi Dynamic Form menggunakan React + Vite + TypeScript + Tailwind CSS.

## Instalasi

```bash
npm install --legacy-peer-deps
```

## Konfigurasi

1. Copy `.env.example` ke `.env`
2. Edit `VITE_API_URL` sesuai dengan URL backend API

## Menjalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## Build untuk Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Struktur Proyek

```
├── src/
│   ├── pages/          # Halaman aplikasi
│   ├── services/       # API services
│   ├── App.tsx         # Komponen utama dengan routing
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles dengan Tailwind
├── components/         # Komponen React
├── lib/                # Utility functions
├── hooks/              # Custom hooks
└── public/             # Static assets
```

## Fitur

- Form dinamis yang dapat dikonfigurasi
- Admin dashboard untuk mengelola form dan melihat respons
- Analytics dan visualisasi data
- Dark mode support
- Responsive design

## URL Routes

- `/` - Halaman utama dengan form
- `/admin` - Admin dashboard (memerlukan login)
- `/success` - Halaman sukses setelah submit form

