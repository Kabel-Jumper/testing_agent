import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  MessageSquare,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lock,
  AlertTriangle,
  HeartHandshake,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import TitikTemuLogo from '@/components/TitikTemuLogo';

export default function CaraKerjaPage() {
  return (
    <div className="min-h-screen bg-[#F4F7F9]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1B4A6B] bg-white border border-[#E2E8F0] shadow-sm mb-4">
            <GraduationCap className="w-4 h-4 text-[#29A9A3]" />
            <span>Panduan Komunitas Kampus 2 UIN Antasari Banjarbaru</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B4A6B] tracking-tight leading-tight mb-4">
            Cara Kerja Titik Temu <br />
            di Lingkungan Kampus 2 UIN Antasari
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Menghubungkan kembali KTM, charger laptop, kunci motor, buku kuliah, dan barang berharga
            milik mahasiswa, dosen, serta tenaga kependidikan di Jl. Pandarapan, Guntung Manggis.
          </p>
        </div>

        {/* 4-Step Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#1B4A6B] text-white flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#1B4A6B] mb-2">Lapor Lokasi Kampus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pilih zona di Kampus 2 (GKT, Perpus, Masjid, Parkiran, Kantin) dan tandai koordinat akurat pada peta.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#1B4A6B]">
              📸 Sensor Privasi Otomatis KTM/Identitas
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#F2823A] text-white flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#1B4A6B] mb-2">Pertanyaan Rahasia</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tulis pertanyaan rahasia yang hanya diketahui pemilik sah (misal: NIM di balik KTM, stiker unik di charger, atau ciri gantungan kunci).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#F2823A]">
              🔒 Menghindari Klaim Salah Sasaran
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#29A9A3] text-white flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#1B4A6B] mb-2">Verifikasi & Kontak</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pengklaim menjawab pertanyaan. Setelah terjawab, tautan WhatsApp langsung terbuka untuk janjian serah terima.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#29A9A3]">
              💬 Koordinasi Cepat via WhatsApp
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-[#1B4A6B] mb-2">Serah Terima & Selesai</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bertemu di titik temu resmi kampus, lalu pelapor menekan "Tandai Sudah Bertemu".
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-600">
              🎉 Laporan Resmi Ditutup
            </div>
          </div>
        </div>

        {/* Safe Meeting Points Guide in Kampus 2 */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 sm:p-10 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1B4A6B]/10 text-[#1B4A6B] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#F2823A]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1B4A6B]">
                Titik Temu Aman di Kampus 2 UIN Antasari
              </h2>
              <p className="text-xs text-slate-500">
                Lokasi resmi dan strategis yang disarankan untuk serah terima barang:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-[#F4F7F9] border border-slate-200">
              <h4 className="text-sm font-bold text-[#1B4A6B] mb-2 flex items-center gap-1.5">
                <span>🏛️ Layanan & Keamanan Kampus</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li>
                  <strong>Meja Layanan Sirkulasi Perpustakaan Pusat</strong> (Lantai 1)
                </li>
                <li>
                  <strong>Pos Satpam Gerbang Masuk Utama</strong> Jl. Pandarapan
                </li>
                <li>
                  <strong>Lobi Utama Gedung Rektorat & Administrasi Terpadu</strong>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F7F9] border border-slate-200">
              <h4 className="text-sm font-bold text-[#29A9A3] mb-2 flex items-center gap-1.5">
                <span>📚 Fakultas & Ruang Publik</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li>
                  <strong>Kantor Bagian Akademik Fakultas</strong> (Tarbiyah, Syariah, Ushuluddin, Dakwah, FEBI)
                </li>
                <li>
                  <strong>Serambi Masjid Kampus 2</strong> UIN Antasari
                </li>
                <li>
                  <strong>Area Gazebo Utama Kantin Mahasiswa</strong> (siang hari)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Community Values */}
        <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 sm:p-8 flex items-start gap-4 mb-12">
          <HeartHandshake className="w-7 h-7 text-[#29A9A3] flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="text-base font-bold text-emerald-950">
              Nilai Kejujuran & Integritas Civitas Akademika
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Sebagai bagian dari kampus Islam UIN Antasari Banjarmasin, platform ini dibangun atas
              dasar tolong-menolong (*ta'awun*) dan amanah. Titik Temu tidak memungut biaya atau
              meminta tebusan apa pun.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/lapor"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-[#F2823A] hover:bg-[#e0712a] shadow-lg transition-all active:scale-95"
          >
            <span>Lapor Barang di Kampus Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
