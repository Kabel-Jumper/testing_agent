-- Titik Temu - Lost and Found Schema
-- Localized for Kampus 2 UIN Antasari Banjarmasin di Banjarbaru (Jl. Pandarapan, Guntung Manggis)
-- Koordinat Pusat Kampus: -3.4675, 114.8195

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    nim_or_nip TEXT,
    faculty_or_unit TEXT DEFAULT 'Fakultas Tarbiyah dan Keguruan',
    role TEXT DEFAULT 'Mahasiswa' CHECK (role IN ('Mahasiswa', 'Dosen', 'Staf Tendik', 'Satpam Kampus')),
    phone_number TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Items (Lost & Found) Table
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'KTM & Dokumen', 
        'Elektronik & Charger', 
        'Kunci & Kendaraan', 
        'Buku & Alat Tulis', 
        'Tas & Botol Minum', 
        'Lainnya'
    )),
    type TEXT NOT NULL CHECK (type IN ('hilang', 'ditemukan')),
    status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai', 'dibatalkan')),
    description TEXT NOT NULL,
    location_name TEXT NOT NULL,
    campus_zone TEXT NOT NULL CHECK (campus_zone IN (
        'Gedung Kuliah / Fakultas',
        'Perpustakaan Pusat',
        'Masjid Kampus',
        'Kantin & Taman',
        'Area Parkir & Gerbang'
    )),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    date_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    photo_url TEXT,
    is_photo_blurred BOOLEAN DEFAULT FALSE,
    security_question TEXT NOT NULL,
    security_answer_hint TEXT,
    reporter_name TEXT NOT NULL,
    reporter_role TEXT DEFAULT 'Mahasiswa UIN Antasari',
    reporter_contact TEXT NOT NULL,
    reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Claims & Verifications Table
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    claimant_name TEXT NOT NULL,
    claimant_contact TEXT NOT NULL,
    claimant_answer TEXT NOT NULL,
    claimant_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'disetujui', 'ditolak')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_items_campus_zone ON public.items(campus_zone);
CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(type);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Items are viewable by everyone" 
ON public.items FOR SELECT USING (true);

CREATE POLICY "Anyone can report an item" 
ON public.items FOR INSERT WITH CHECK (true);

CREATE POLICY "Reporters can update their items" 
ON public.items FOR UPDATE USING (auth.uid() = reporter_user_id OR reporter_user_id IS NULL);

CREATE POLICY "Reporters can view claims on their items" 
ON public.claims FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.items 
        WHERE public.items.id = public.claims.item_id 
        AND (public.items.reporter_user_id = auth.uid() OR public.claims.claimant_user_id = auth.uid() OR auth.role() = 'anon')
    )
);

CREATE POLICY "Anyone can submit a claim" 
ON public.claims FOR INSERT WITH CHECK (true);

-- Seed Sample Data for Kampus 2 UIN Antasari Banjarbaru (Center: -3.4675, 114.8195)
INSERT INTO public.items (
    title, category, type, status, description, location_name, campus_zone, latitude, longitude, 
    date_time, photo_url, is_photo_blurred, security_question, reporter_name, reporter_role, reporter_contact
) VALUES
(
    'KTM Mahasiswa UIN Antasari & Dompet Kulit Coklat',
    'KTM & Dokumen',
    'ditemukan',
    'aktif',
    'Ditemukan tertinggal di meja bilik baca lantai 2 Perpustakaan Pusat Kampus 2 UIN Antasari. Di dalamnya ada Kartu Tanda Mahasiswa (KTM) Fakultas Tarbiyah dan Keguruan, SIM C, dan kartu Flazz.',
    'Perpustakaan Pusat Kampus 2 (Lantai 2 Ruang Baca)',
    'Perpustakaan Pusat',
    -3.4678000,
    114.8201000,
    NOW() - INTERVAL '2 hours',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    true,
    'Sebutkan Nama Lengkap, Program Studi, dan 3 digit terakhir NIM yang tertera di KTM',
    'Siti Rahmawati, S.I.Pust.',
    'Staf Layanan Perpustakaan',
    '085248112233'
),
(
    'Kunci Kontak Honda Scoopy + Gantungan Sasirangan Hijau',
    'Kunci & Kendaraan',
    'ditemukan',
    'aktif',
    'Ditemukan masih tergantung di stop kontak motor Honda Scoopy abu-abu di area parkir utama samping pos satpam gerbang Jl. Pandarapan. Demi keamanan kunci diamankan petugas satpam pos jaga.',
    'Gerbang Utama & Pos Satpam (Parkiran Samping Gerbang Jl. Pandarapan)',
    'Area Parkir & Gerbang',
    -3.4658000,
    114.8188000,
    NOW() - INTERVAL '4 hours',
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    false,
    'Sebutkan 3 huruf belakang plat nomor motor Scoopy Anda atau ciri gantungan kain tambahan',
    'Pak Ahmad (Komandan Regu Satpam Kampus 2)',
    'Satpam Kampus',
    '081349887711'
),
(
    'Charger Fast Charging Laptop USB Type-C 65W Baseus Hitam',
    'Elektronik & Charger',
    'hilang',
    'aktif',
    'Tertinggal di colokan dinding baris ketiga sebelah kiri ruang kuliah 304 Gedung Kuliah Terpadu (GKT) Kampus 2 setelah perkuliahan Metodologi Penelitian jam 11.30 siang.',
    'Gedung Kuliah Terpadu / Rektorat (GKT Lt. 3 Ruang 304)',
    'Gedung Kuliah / Fakultas',
    -3.4672000,
    114.8193000,
    NOW() - INTERVAL '6 hours',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    false,
    'Sebutkan warna kabel bawaan charger dan ada stiker kecil apa di sisi adaptornya',
    'Muhammad Ilham Fauzi',
    'Mahasiswa Fakultas Dakwah',
    '081255890123'
),
(
    'Tumbler Stainless Corkcicle Warna Mint / Hijau Tosca',
    'Tas & Botol Minum',
    'ditemukan',
    'aktif',
    'Ditemukan di dekat rak sepatu serambi samping Masjid Kampus 2 UIN Antasari setelah sholat Dzuhur berjamaah. Kondisi bersih, terdapat stiker kaligrafi kecil.',
    'Masjid Kampus (Serambi Samping Tempat Wudhu)',
    'Masjid Kampus',
    -3.4683000,
    114.8189000,
    NOW() - INTERVAL '10 hours',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    false,
    'Sebutkan tulisan pada stiker kaligrafi atau goresan khas di bagian bawah botol',
    'Ustadz Fathurrahman, M.Ag.',
    'Dosen / Takmir Masjid Kampus',
    '087814552200'
),
(
    'Buku Diktat Fiqh Muamalah & Binder Catatan Kuliah Hijau',
    'Buku & Alat Tulis',
    'hilang',
    'aktif',
    'Diduga tertinggal di kursi tunggu depan Ruang Pelayanan Administrasi Fakultas Syariah Kampus 2. Berisi catatan materi penting untuk persiapan ujian komprehensif.',
    'Area Parkir & Fakultas (Gedung Fakultas Syariah Lt. 1)',
    'Gedung Kuliah / Fakultas',
    -3.4669000,
    114.8205000,
    NOW() - INTERVAL '1 day',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    false,
    'Sebutkan nama pemilik yang tertulis di balik cover binder catatan kuliah tersebut',
    'Nur Aisyah Az-Zahra',
    'Mahasiswi Fakultas Syariah',
    '082155667788'
),
(
    'Jaket Almamater Hijau Tua UIN Antasari Size L',
    'Tas & Botol Minum',
    'ditemukan',
    'aktif',
    'Ditemukan tergantung di sandaran kursi kayu kantin kampus 2 UIN Antasari dekat stan es teh manis. Jaket bersih beremblem bordir logo UIN Antasari di dada kiri.',
    'Kantin & Taman (Gazebo Utama Kantin Mahasiswa)',
    'Kantin & Taman',
    -3.4676000,
    114.8197000,
    NOW() - INTERVAL '1 hour',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    false,
    'Sebutkan benda yang tertinggal di dalam saku kanan jaket almamater tersebut',
    'Ibu Maryam (Pengelola Kantin)',
    'Staf Kantin',
    '089691234567'
);
