# RSIA Sayang Ibu Batusangkar - Web Portal & CMS (V2)

Sistem Informasi Web Resmi dan Content Management System (CMS) terpadu untuk **Rumah Sakit Ibu dan Anak (RSIA) Sayang Ibu Batusangkar**, Kabupaten Tanah Datar, Sumatera Barat.

Aplikasi telah sepenuhnya dibersihkan dari data dummy/mock dan disiapkan secara terstruktur untuk dihubungkan dengan Backend REST API.

---

## 📌 Dokumen Penting
- **Dokumentasi API Backend**: [`API_DOCUMENTATION.txt`](API_DOCUMENTATION.txt) *(Spesifikasi detail 11 modul endpoint, skema basis data, dan format request/response JSON untuk Backend Developer)*
- **Dokumentasi Frontend Aplikasi**: [`CLIENT/README.md`](CLIENT/README.md)

---

## 🚀 Memulai (Quick Start)

### Menjalankan Frontend
```bash
cd CLIENT
npm install
npm run dev
```
Akses web melalui browser di `http://localhost:5173`.

### Memvalidasi & Build Produksi
```bash
cd CLIENT
npm run build
```

---

## 🏛️ Arsitektur Proyek

Proyek ini terdiri dari:
1. **Frontend App (`CLIENT/`)**:
   - Web Publik: Beranda, Direktori Dokter Spesialis, Layanan Medis, Edukasi Artikel Kesehatan, Fasilitas, Landing Page Promo Microsite, Pendaftaran Pasien Online 24 Jam.
   - Portal Admin CMS: Dashboard Metrik, Kelola Pendaftaran & Antrean Online, Kelola Dokter, Layanan, Artikel, Iklan/Promo, Media Storage, Profil RS, dan Akun Pengguna.
2. **Spesifikasi API Backend (`API_DOCUMENTATION.txt`)**:
   - Standar RESTful JSON API v1
   - Autentikasi JWT Bearer Token dengan Role (*Super Admin*, *Admin*, *Editor*)
   - Skema Database lengkap: `users`, `doctors`, `services`, `articles`, `ad_campaigns`, `appointments`, `job_vacancies`, `media`, `hospital_settings`, `registration_settings`
   - Kontrak endpoint untuk integrasi backend (Laravel, Node.js/Express, Golang, FastAPI, dll.)

---

## 🔒 Lisensi & Hak Cipta
Hak Cipta © 2024 - 2026 **RSIA Sayang Ibu Batusangkar**, Sumatera Barat.
