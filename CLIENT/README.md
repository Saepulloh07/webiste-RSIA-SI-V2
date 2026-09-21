# RSIA Sayang Ibu Batusangkar - Web Portal & CMS (V2)

Website resmi dan Portal Content Management System (CMS) modern untuk **Rumah Sakit Ibu dan Anak (RSIA) Sayang Ibu Batusangkar**, Kabupaten Tanah Datar, Sumatera Barat.

Aplikasi ini dibangun dengan standar arsitektur frontend modern, performa tinggi, tampilan estetis responsif (mobile-first), serta telah dibersihkan sepenuhnya dari data mock/dummy sehingga siap diintegrasikan langsung dengan Backend REST API.

---

## 🚀 Fitur Utama

### 1. Website Publik (Pasien & Keluarga)
- **Beranda Interaktif**: Hero section elegan, sorotan layanan unggulan, direktori dokter spesialis terpercaya, publikasi artikel edukasi, dan company profile.
- **Direktori Dokter Spesialis**: Pencarian real-time berdasarkan nama dokter dan filter spesialisasi (Kandungan, Anak, dsb). Profil lengkap meliputi jadwal praktik, sub-spesialisasi, nomor SIP, dan riwayat pendidikan.
- **Layanan Medis & Fasilitas**: Informasi komprehensif poliklinik, rawat inap VIP, UGD 24 jam, laboratorium terpadu, dan fasilitas medis modern.
- **Pusat Edukasi & Artikel Kesehatan**: Berita medis, tips kehamilan, nutrisi tumbuh kembang anak, dan metode persalinan ERACS lengkap dengan SEO Schema Markup.
- **Microsite Promo & Kampanye**: Landing page promosi persalinan dan pemeriksaan USG 4D dengan timer countdown konversi tinggi dan tombol pendaftaran WhatsApp otomatis.
- **Pendaftaran Pasien Online (Online Booking)**: Formulir registrasi digital 24 jam dengan pemilihan poliklinik, dokter tujuan, metode pembayaran (BPJS, Umum, Asuransi), validasi kuota harian, dan penerbitan Nomor Registrasi instan (`REG-XXXXXX`).
- **Informasi Pasien & Kontak Resmi**: Tata tertib rawat inap, jam berkunjung, panduan pendaftaran BPJS, peta lokasi Google Maps, dan tombol darurat WhatsApp / IGD 24 Jam.

### 2. Portal Manajemen CMS (Admin Panel)
- **Dashboard Metrik**: Ringkasan jumlah dokter aktif, layanan poliklinik, artikel terbit, dan antrean pendaftaran online hari ini.
- **Kelola Pendaftaran Online**: Pantau antrean pasien secara real-time, filter pencarian data, ubah status antrean (*Menunggu*, *Dikonfirmasi*, *Selesai*, *Batal*), serta hapus antrean.
- **Pengaturan Form Pendaftaran**: Buka/tutup akses formulir publik, tentukan batas kuota harian, dan atur pesan pengumuman untuk pasien.
- **Kelola Dokter**: Tambah, edit, dan hapus dokter spesialis, jadwal konsultasi, foto dokter, dan sertifikasi keahlian.
- **Kelola Layanan**: Manajemen daftar layanan poli dan fasilitas penunjang rumah sakit.
- **Kelola Artikel**: Penulisan artikel edukasi dengan Rich Text Editor, kategori, tags, dan status publikasi (*Published* / *Draft*).
- **Kelola Iklan & Promo**: Pembuatan landing page promo, badge penawaran, harga diskon, dan kata kunci target SEO/Google Ads.
- **Media Library**: Penyimpanan dan pengelolaan berkas media (gambar banner, slideshow, video link, dokumen).
- **Kelola Lowongan Karir**: Formasi rekrutmen tenaga medis dan staf profesional rumah sakit.
- **Pengaturan Profil Web**: Konfigurasi nama rumah sakit, slogan, kontak darurat IGD, nomor WhatsApp resmi, alamat, embed Google Maps, dan tautan media sosial.
- **Manajemen Pengguna CMS**: Pengaturan wewenang staf pengelola dengan role bertingkat (*Super Admin*, *Admin*, *Editor*).

---

## 🛠️ Teknologi & Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: Vanilla Tailwind CSS v4 dengan sistem palet warna kurasi (*Rose*, *Amber/Gold*, *Emerald*, *Slate*)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) dengan middleware `persist` (Local Storage)
- **Form & Validasi**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Animasi**: [Motion](https://motion.dev/) (Framer Motion)

---

## 📦 Panduan Instalasi & Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.x atau lebih tinggi.
- Package manager `npm`, `pnpm`, atau `bun`.

### Langkah-langkah Menjalankan:
1. Masuk ke direktori `CLIENT`:
   ```bash
   cd CLIENT
   ```
2. Pasang seluruh dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
4. Buka browser pada alamat yang muncul di terminal (biasanya `http://localhost:5173`).

### Build untuk Produksi:
Untuk memvalidasi sintaks TypeScript dan membuat bundle teroptimasi:
```bash
npm run build
```
Hasil build akan berada di direktori `CLIENT/dist`.

---

## 🔌 Integrasi Backend REST API

Aplikasi frontend ini telah disiapkan untuk langsung terhubung dengan Backend REST API. Seluruh struktur data dan kontrak endpoint telah didokumentasikan secara detail untuk Backend Developer:

👉 **Lihat Dokumentasi Lengkap API**: [`../API_DOCUMENTATION.txt`](../API_DOCUMENTATION.txt)

Dokumentasi tersebut mencakup 11 modul endpoint:
1. `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `POST /api/v1/auth/logout`
2. `GET /api/v1/doctors`, `POST /api/v1/doctors`, `PUT /api/v1/doctors/:id`, `DELETE /api/v1/doctors/:id`
3. `GET /api/v1/services`, `POST /api/v1/services`, `PUT /api/v1/services/:id`, `DELETE /api/v1/services/:id`
4. `GET /api/v1/articles`, `POST /api/v1/articles`, `PUT /api/v1/articles/:id`, `DELETE /api/v1/articles/:id`
5. `GET /api/v1/ads`, `POST /api/v1/ads`, `PUT /api/v1/ads/:id`, `DELETE /api/v1/ads/:id`
6. `POST /api/v1/appointments` (Pendaftaran Online Publik Pasien)
7. `GET /api/v1/appointments`, `PATCH /api/v1/appointments/:id/status`, `DELETE /api/v1/appointments/:id` (Antrean Admin)
8. `GET /api/v1/vacancies`, `POST /api/v1/vacancies`, `PUT /api/v1/vacancies/:id`, `DELETE /api/v1/vacancies/:id`
9. `GET /api/v1/media`, `POST /api/v1/media/upload` (Multipart), `DELETE /api/v1/media/:id`
10. `GET /api/v1/settings`, `PUT /api/v1/settings`, `GET /api/v1/settings/registration`, `PUT /api/v1/settings/registration`
11. `GET /api/v1/dashboard/stats`, `GET /api/v1/users`, `POST /api/v1/users`, `PUT /api/v1/users/:id`, `DELETE /api/v1/users/:id`

---

## 📁 Struktur Direktori

```
webiste RSIA SI V2/
├── API_DOCUMENTATION.txt          # Spesifikasi lengkap REST API untuk Backend Developer
├── README.md                      # Dokumentasi root workspace
└── CLIENT/
    ├── README.md                  # Dokumentasi teknis aplikasi frontend
    ├── package.json               # Konfigurasi dependensi dan scripts
    ├── vite.config.ts             # Konfigurasi Vite & path alias (@/)
    ├── tsconfig.json              # Konfigurasi compiler TypeScript
    ├── public/                    # Aset statis publik (logo, favicon)
    └── src/
        ├── App.tsx                # Konfigurasi router utama (Public & Admin Routes)
        ├── main.tsx               # Entry point aplikasi React
        ├── index.css              # Setup stylesheet Tailwind & font inter/playfair
        ├── store/
            └── index.ts           # State Management (Zustand) tanpa mock data
        ├── components/
            ├── common/            # Watermark, SEO Head, Hospital Logo, ScrollToTop
            ├── layout/            # Navbar publik, footer, admin sidebar & header
            ├── cards/             # DoctorCard, ServiceCard
            └── ui/                # Button, Modal, Table, Badge, Input, RichTextEditor
        ├── pages/
            ├── public/            # Halaman Publik (Home, Doctors, Services, Articles,
            │                      #   Facilities, Appointment, PromoMicrosite, Contact)
            └── admin/             # Halaman CMS (Dashboard, Login, ManageDoctors,
                                   #   ManageAppointments, ManageArticles, ManageServices,
                                   #   ManageAds, ManageMedia, ManageSettings, ManageUsers)
        ├── types/                 # Definisi tipe global TypeScript
        └── utils/                 # Helper fungsi dan utilities
```

---

## 🔒 Hak Cipta & Lisensi
Hak Cipta © 2024 - 2026 **RSIA Sayang Ibu Batusangkar**, Kabupaten Tanah Datar, Sumatera Barat. Seluruh hak cipta dilindungi undang-undang.
