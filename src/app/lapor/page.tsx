'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  PlusCircle,
  MapPin,
  Calendar,
  Camera,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import LocationPickerMap from '@/components/Map/LocationPickerMap';
import { ItemCategory, ItemType, CampusZone, CAMPUS_ZONE_COORDINATES } from '@/types';
import { createItem, getCurrentUser } from '@/lib/store';

const CAMPUS_CATEGORIES: ItemCategory[] = [
  'KTM & Dokumen',
  'Elektronik & Charger',
  'Kunci & Kendaraan',
  'Buku & Alat Tulis',
  'Tas & Botol Minum',
  'Lainnya',
];

const CAMPUS_ZONES_LIST: CampusZone[] = [
  'Gedung Kuliah / Fakultas',
  'Perpustakaan Pusat',
  'Masjid Kampus',
  'Kantin & Taman',
  'Area Parkir & Gerbang',
];

const PRESET_CAMPUS_LOCATIONS: {
  name: string;
  zone: CampusZone;
  lat: number;
  lng: number;
}[] = [
  {
    name: 'Perpustakaan Pusat Kampus 2 (Lt. 2 Ruang Baca)',
    zone: 'Perpustakaan Pusat',
    lat: -3.483,
    lng: 114.8433,
  },
  {
    name: 'Gedung Kuliah Terpadu (GKT Ruang Kuliah)',
    zone: 'Gedung Kuliah / Fakultas',
    lat: -3.4838,
    lng: 114.8429,
  },
  {
    name: 'Masjid Kampus 2 UIN Antasari (Serambi & Wudhu)',
    zone: 'Masjid Kampus',
    lat: -3.4826,
    lng: 114.8418,
  },
  {
    name: 'Area Parkir Utama Mahasiswa (Dekat Gerbang Jl. Pandarapan)',
    zone: 'Area Parkir & Gerbang',
    lat: -3.4845,
    lng: 114.8415,
  },
  {
    name: 'Kantin Mahasiswa Kampus 2 (Gazebo Belakang)',
    zone: 'Kantin & Taman',
    lat: -3.4841,
    lng: 114.8422,
  },
  {
    name: 'Gedung Fakultas Syariah (Lantai 1)',
    zone: 'Gedung Kuliah / Fakultas',
    lat: -3.4836,
    lng: 114.8436,
  },
  {
    name: 'Fakultas Ushuluddin & Humaniora (Lab Komputer)',
    zone: 'Gedung Kuliah / Fakultas',
    lat: -3.4828,
    lng: 114.8426,
  },
];

function LaporFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as ItemType) || 'hilang';

  const [type, setType] = useState<ItemType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('KTM & Dokumen');
  const [campusZone, setCampusZone] = useState<CampusZone>('Gedung Kuliah / Fakultas');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(-3.4835);
  const [longitude, setLongitude] = useState(114.8425);
  const [dateTime, setDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isPhotoBlurred, setIsPhotoBlurred] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState('Mahasiswa UIN Antasari');
  const [reporterContact, setReporterContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setReporterName(user.full_name);
      if (user.phone_number) setReporterContact(user.phone_number);
      if (user.role) setReporterRole(`${user.role} - ${user.faculty_or_unit || 'UIN Antasari'}`);
    }
  }, []);

  const handleZoneChange = (zone: CampusZone) => {
    setCampusZone(zone);
    const coords = CAMPUS_ZONE_COORDINATES[zone];
    if (coords) {
      setLatitude(coords.center[0]);
      setLongitude(coords.center[1]);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_CAMPUS_LOCATIONS[0]) => {
    setCampusZone(preset.zone);
    setLocationName(preset.name);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
  };

  const handlePhotoUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !securityQuestion.trim() || !reporterName.trim() || !reporterContact.trim()) {
      alert('Harap lengkapi semua kolom yang bertanda bintang (*).');
      return;
    }

    setIsSubmitting(true);
    const user = getCurrentUser();

    const newItem = createItem({
      title,
      category,
      type,
      description,
      location_name: locationName,
      campus_zone: campusZone,
      latitude,
      longitude,
      date_time: new Date(dateTime).toISOString(),
      photo_url: photoUrl || (type === 'hilang'
        ? 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'),
      is_photo_blurred: isPhotoBlurred,
      security_question: securityQuestion,
      reporter_name: reporterName,
      reporter_role: reporterRole,
      reporter_contact: reporterContact,
      reporter_user_id: user?.id,
    });

    setIsSubmitting(false);
    router.push(`/barang/${newItem.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1B4A6B] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda Kampus</span>
      </button>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-[#F4F7F9] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-[#29A9A3]/10 text-[#29A9A3]">
              <GraduationCap className="w-5 h-5 text-[#29A9A3]" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B4A6B]">
              Layanan Kampus 2 UIN Antasari Banjarbaru
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4A6B]">
            Buat Laporan Barang di Kampus
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Bantu sesama mahasiswa, dosen, dan staf menemukan kembali KTM, charger, kunci, atau buku yang tercecer.
          </p>

          {/* Toggle Type: Hilang vs Ditemukan */}
          <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setType('hilang')}
              className={`py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                type === 'hilang'
                  ? 'bg-[#F2823A] text-white border-[#F2823A] shadow-md scale-102'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Saya Kehilangan</span>
            </button>
            <button
              type="button"
              onClick={() => setType('ditemukan')}
              className={`py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                type === 'ditemukan'
                  ? 'bg-[#29A9A3] text-white border-[#29A9A3] shadow-md scale-102'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Saya Menemukan</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-2">
              Nama Barang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: KTM Tarbiyah & Dompet Coklat, Kunci Kontak Scoopy, Charger Type-C GKT"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
            />
          </div>

          {/* Category & Campus Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-2">
                Kategori Kampus <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3] bg-white"
              >
                {CAMPUS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-2">
                Zona Kampus 2 <span className="text-red-500">*</span>
              </label>
              <select
                value={campusZone}
                onChange={(e) => handleZoneChange(e.target.value as CampusZone)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3] bg-white"
              >
                {CAMPUS_ZONES_LIST.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time and Specific Location Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-2">
                Waktu Kejadian <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-2">
                Nama Ruangan / Patokan Spesifik <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Contoh: Perpustakaan Lt. 2 Ruang Baca, GKT Ruang 304, Parkir Motor Depan"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
              />
            </div>
          </div>

          {/* Quick Preset Location Pills in Kampus 2 */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              Pilih Cepat Titik Populer Kampus 2 UIN Antasari:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CAMPUS_LOCATIONS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-[#29A9A3]/10 hover:text-[#29A9A3] text-slate-700 border border-slate-200 transition-colors"
                >
                  📍 {p.name.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Map Pin Picker on Kampus 2 */}
          <div>
            <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-2">
              Tandai Titik Lokasi Pada Peta Kampus 2 (Zoom Detail)
            </label>
            <LocationPickerMap
              latitude={latitude}
              longitude={longitude}
              campusZone={campusZone}
              onChangeCoordinates={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-2">
              Deskripsi & Ciri-ciri Umum <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan kronologi singkat dan ciri umum yang terlihat di luar..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
            />
          </div>

          {/* Photo Upload & Privacy Blur Checkbox */}
          <div className="bg-[#F4F7F9] p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1.5">
                Foto Barang (Opsional namun sangat disarankan)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                  <Camera className="w-4 h-4 text-[#29A9A3]" />
                  <span>Unggah dari Galeri / Kamera</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUploadMock}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">Atau tempel URL gambar</span>
              </div>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="mt-2 w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
              />
            </div>

            {/* Photo Preview & Privacy Blur Toggle */}
            {photoUrl && (
              <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className={`w-20 h-20 rounded-xl object-cover border border-slate-300 ${
                    isPhotoBlurred ? 'filter blur-sm' : ''
                  }`}
                />
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Preview Foto</p>
                  <p className="text-[11px] text-slate-500">
                    {isPhotoBlurred ? 'Foto disamarkan untuk privasi' : 'Foto terlihat jelas'}
                  </p>
                </div>
              </div>
            )}

            {/* Privacy Blur Checkbox */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="blurCheck"
                checked={isPhotoBlurred}
                onChange={(e) => setIsPhotoBlurred(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#29A9A3] rounded border-slate-300 focus:ring-[#29A9A3]"
              />
              <label htmlFor="blurCheck" className="text-xs text-slate-700 cursor-pointer select-none">
                <span className="font-bold text-[#1B4A6B]">
                  Aktifkan Sensor Privasi (Blur Foto Otomatis)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sangat direkomendasikan jika foto menampilkan <strong>KTM</strong>, <strong>SIM</strong>, <strong>STNK</strong>, atau <strong>kartu ATM</strong> agar NIM dan data pribadi tidak disalahgunakan.
                </p>
              </label>
            </div>
          </div>

          {/* Security Verification Question */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F2823A]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Pertanyaan Verifikasi Bukti Pemilik (Wajib)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tanyakan satu ciri rahasia yang hanya diketahui oleh pemilik asli (misal: tulisan catatan di halaman depan buku, stiker di charger, 3 digit NIM di KTM, atau gantungan kunci motor).
            </p>
            <input
              type="text"
              required
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              placeholder="Contoh: Sebutkan Program Studi & 3 digit terakhir NIM di KTM, atau stiker apa di charger?"
              className="w-full px-4 py-3 rounded-xl border border-amber-300 text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#F2823A]"
            />
          </div>

          {/* Reporter Contact Info */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-[#1B4A6B] mb-3">Informasi Kontak Pelapor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Anda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status di Kampus <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value)}
                  placeholder="Mahasiswa Tarbiyah / Dosen / Satpam"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No. WhatsApp / HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="0812xxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-2xl text-base font-bold text-white transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
                type === 'hilang'
                  ? 'bg-[#F2823A] hover:bg-[#e0712a]'
                  : 'bg-[#29A9A3] hover:bg-[#23928d]'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {isSubmitting
                  ? 'Menerbitkan Laporan...'
                  : type === 'hilang'
                  ? 'Terbitkan Laporan Kehilangan di Kampus'
                  : 'Terbitkan Laporan Temuan Barang'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LaporPage() {
  return (
    <div className="min-h-screen bg-[#F4F7F9]">
      <Navbar />
      <Suspense fallback={<div className="p-10 text-center text-sm text-slate-500">Memuat Formulir Kampus...</div>}>
        <LaporFormContent />
      </Suspense>
    </div>
  );
}
