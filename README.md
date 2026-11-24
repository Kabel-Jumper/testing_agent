# titik temu — Lost & Found Kampus 2 UIN Antasari Banjarmasin (Banjarbaru)

**titik temu** adalah aplikasi web Lost and Found komunitas berbasis Next.js 15 yang dikhususkan dan disesuaikan untuk civitas akademika (mahasiswa, dosen, dan tenaga kependidikan) **Kampus 2 UIN Antasari Banjarmasin** yang beralamat di **Jl. Pandarapan, Kelurahan Guntung Manggis, Kota Banjarbaru, Kalimantan Selatan**.

---

## 🏛️ Penyesuaian Khusus Kampus 2 UIN Antasari

1. **Koordinat & Zoom Peta (Leaflet + OpenStreetMap)**:
   - Titik Pusat Default: **`-3.4835, 114.8425`** (Area Inti Kampus 2 UIN Antasari Banjarbaru).
   - Tingkat Zoom Dekat: **Zoom 16.5 - 18** sehingga denah gedung perkuliahan, masjid, perpustakaan, jalur pejalan kaki, dan area parkir terlihat detail dan presisi.

2. **Zona & Titik Kampus (Pill Filter & Navigasi)**:
   - `Semua Area Kampus` (Pusat Kampus)
   - `Gedung Kuliah / Fakultas` (Gedung Kuliah Terpadu / GKT, Fakultas Tarbiyah, Syariah, Ushuluddin, Dakwah, FEBI)
   - `Perpustakaan Pusat` (Lantai 1 Layanan & Lantai 2 Bilik Baca)
   - `Masjid Kampus` (Serambi Sholat, Tempat Wudhu, & Rak Sepatu)
   - `Kantin & Taman` (Kantin Mahasiswa, Gazebo, & Taman Rindang)
   - `Area Parkir & Gerbang` (Parkiran Motor Utama Mahasiswa & Pos Satpam Jl. Pandarapan)

3. **Kategori Khas Kebutuhan Mahasiswa & Kampus**:
   - `KTM & Dokumen` (Kartu Tanda Mahasiswa, KTP, SIM, Berkas Wisuda/Skripsi)
   - `Elektronik & Charger` (Charger Laptop USB Type-C, Powerbank, TWS/Earphone, Flashdisk)
   - `Kunci & Kendaraan` (Kunci Motor Scoopy/Vario/Beat, Kunci Gembok Loker)
   - `Buku & Alat Tulis` (Diktat Kuliah, Buku Perpustakaan, Binder Catatan, Kotak Pensil)
   - `Tas & Botol Minum` (Tumbler Corkcicle/Tupperware, Ransel Laptop, Jaket Almamater)
   - `Lainnya`

4. **Sistem Verifikasi Rahasia & Perlindungan Privasi**:
   - **Sensor Privasi Foto Otomatis**: Foto KTM, KTP, atau kartu identitas otomatis disensor (blur) agar nomor induk mahasiswa (NIM) dan data pribadi aman dari penyalahgunaan.
   - **Pertanyaan Verifikasi Keamanan**: Mewajibkan penemu/pelapor menanyakan ciri khas tersembunyi yang hanya diketahui pemilik sah sebelum kontak WhatsApp langsung dibuka.

---

## 🎨 Brand Identity & Design System

- **Primary Dark Blue (`#1B4A6B`)**: Judul utama, teks struktural, header, dan border aktif.
- **Primary Teal (`#29A9A3`)**: Badge "Ditemukan", tombol interaktif utama, tab filter aktif.
- **Urgent Orange (`#F2823A`)**: Badge "Hilang", tombol aksi darurat "Lapor Kehilangan", dot tengah logo & pin peta.
- **Background Soft Slate (`#F4F7F9`)**: Latar belakang halaman & hero section.
- **Card Background (`#FFFFFF`)**: Kartu informasi, navbar, dan kontainer utama.
- **Body Text (`#334155`)** & **Border (`#E2E8F0`)**.

---

## 💻 Menjalankan Aplikasi

Aplikasi telah berjalan pada development server lokal:
```bash
npm run dev -- -p 3000
```
Buka browser di: **[http://localhost:3000](http://localhost:3000)**.

Untuk kompilasi produksi:
```bash
npm run build
npm run start
```
