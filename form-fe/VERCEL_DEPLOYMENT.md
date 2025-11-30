# Vercel Deployment Troubleshooting

## Error 404 NOT_FOUND

Jika Anda mendapatkan error 404 NOT_FOUND setelah deployment, ikuti langkah berikut:

### 1. Pastikan Konfigurasi di Vercel Dashboard

Di **Settings → General**:
- **Framework Preset**: Pilih "Other" atau biarkan auto-detect
- **Root Directory**: `form-fe` (jika deploy dari root repo)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install --legacy-peer-deps`

### 2. Pastikan vercel.json Ada di Root form-fe

File `vercel.json` harus ada di folder `form-fe/` dengan isi:
```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Pastikan Environment Variables

Di **Settings → Environment Variables**, pastikan:
- `VITE_API_URL` = URL backend API Anda

### 4. Cek Build Logs

1. Buka deployment di Vercel Dashboard
2. Klik pada deployment yang gagal
3. Lihat **Build Logs** untuk error detail
4. Pastikan build berhasil dan file `dist/index.html` ada

### 5. Redeploy

Setelah mengubah konfigurasi:
1. Commit dan push perubahan
2. Atau klik **Redeploy** di Vercel Dashboard

### 6. Jika Masih Error

Coba hapus semua konfigurasi di Vercel Dashboard dan biarkan hanya `vercel.json` yang mengatur, atau sebaliknya.

