# 🔧 FIX: Error 404 NOT_FOUND di Vercel

## ⚠️ Masalah
GET `/` → 404 Not Found di `form-survei-wisuda.vercel.app`

## ✅ Solusi yang Sudah Diterapkan

### 1. File `vercel.json` Sudah Diperbaiki
Format sudah diubah ke `routes` yang lebih kompatibel:

```json
{
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. Konfigurasi Vite Sudah Diperbaiki
- Base path: `/`
- Output directory: `dist`
- Assets directory: `assets`

## 🎯 LANGKAH PENTING DI VERCEL DASHBOARD

### Step 1: Buka Project Settings
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project `form-survei-wisuda`
3. Klik **Settings** → **General**

### Step 2: Set Root Directory (PENTING!)
Jika repository root adalah `dynamic-form-application`:
- **Root Directory**: `form-fe` ✅
- Klik **Save**

### Step 3: Set Build & Output Settings
Di **Settings → General**, set:
- **Framework Preset**: `Other` atau biarkan auto-detect
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install --legacy-peer-deps`
- **Node.js Version**: `18.x` atau `20.x`

### Step 4: Verifikasi Environment Variables
Di **Settings → Environment Variables**:
- Pastikan `VITE_API_URL` sudah di-set
- Value: URL backend API Anda (contoh: `https://your-backend.vercel.app/api`)

### Step 5: Hapus Deployment Lama & Redeploy
1. Klik **Deployments** tab
2. Pilih deployment terbaru
3. Klik **⋯** (three dots) → **Delete**
4. Klik **Deployments** → **Create Deployment**
5. Atau push commit baru ke GitHub (auto-deploy)

## 🔍 Troubleshooting

### Jika Masih 404 Setelah Langkah di Atas:

#### A. Cek Build Logs
1. Buka deployment yang gagal
2. Lihat **Build Logs**
3. Pastikan:
   - ✅ Build berhasil (exit code 0)
   - ✅ File `dist/index.html` ada di output
   - ✅ Tidak ada error TypeScript

#### B. Cek File Structure di Vercel
Di **Deployments** → **View Build Logs** → scroll ke bawah, cek:
```
✓ Built in X.XXs
dist/index.html
dist/assets/...
```

#### C. Test Build Lokal
```bash
cd form-fe
npm run build
ls dist/
# Harus ada: index.html, assets/, icon.svg, dll
```

#### D. Cek Root Directory
Jika Root Directory salah:
- Vercel akan mencari file di lokasi yang salah
- Pastikan Root Directory = `form-fe` (jika repo root adalah `dynamic-form-application`)

#### E. Cek Output Directory
Jika Output Directory salah:
- Vercel tidak akan menemukan `index.html`
- Pastikan Output Directory = `dist`

## 📝 Checklist Sebelum Redeploy

- [ ] File `vercel.json` ada di `form-fe/vercel.json`
- [ ] Root Directory di Vercel = `form-fe`
- [ ] Output Directory di Vercel = `dist`
- [ ] Build Command = `npm run build`
- [ ] Install Command = `npm install --legacy-peer-deps`
- [ ] Environment Variable `VITE_API_URL` sudah di-set
- [ ] Build lokal berhasil (`npm run build`)
- [ ] File `dist/index.html` ada
- [ ] Sudah commit & push perubahan `vercel.json`

## 🚀 Setelah Redeploy

1. Tunggu build selesai (biasanya 1-2 menit)
2. Buka URL: `https://form-survei-wisuda.vercel.app/`
3. Seharusnya tidak lagi 404

## ❓ Masih Error?

Jika masih 404 setelah semua langkah di atas:
1. Screenshot **Settings → General** di Vercel Dashboard
2. Screenshot **Build Logs** dari deployment terbaru
3. Kirimkan ke saya untuk analisis lebih lanjut

