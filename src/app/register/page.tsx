'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  MapPin,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import TitikTemuLogo from '@/components/TitikTemuLogo';
import { setCurrentUser } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nimOrNip, setNimOrNip] = useState('');
  const [faculty, setFaculty] = useState('Fakultas Tarbiyah dan Keguruan');
  const [role, setRole] = useState<'Mahasiswa' | 'Dosen' | 'Staf Tendik'>('Mahasiswa');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setCurrentUser({
        id: `user-${Date.now()}`,
        full_name: fullName,
        email,
        phone_number: phone,
        nim_or_nip: nimOrNip,
        faculty_or_unit: faculty,
        role,
        avatar_url:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      });
      setIsLoading(false);
      router.push('/');
    }, 400);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left 50% Column */}
      <div className="relative bg-[#F4F7F9] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-r border-[#E2E8F0] overflow-hidden">
        <div className="relative z-10">
          <TitikTemuLogo size="lg" showTagline={true} />
        </div>

        <div className="relative z-10 my-12 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#1B4A6B] bg-white border border-[#E2E8F0] shadow-sm mb-4">
            <GraduationCap className="w-4 h-4 text-[#29A9A3]" />
            <span>Pendaftaran Civitas Kampus 2 UIN Antasari</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B4A6B] leading-tight mb-4">
            Bergabung dengan Komunitas Titik Temu Kampus
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Daftar untuk memantau status barang hilang Anda, menerima notifikasi saat ada temuan baru,
            dan membantu sesama warga UIN Antasari Banjarbaru.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#29A9A3]" />
              <span>Verifikasi bukti kepemilikan terpercaya</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <MapPin className="w-4 h-4 text-[#F2823A]" />
              <span>Terintegrasi di seluruh zona Kampus 2 Jl. Pandarapan</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          📍 Khusus untuk civitas akademika UIN Antasari Banjarmasin di Kampus Banjarbaru.
        </div>
      </div>

      {/* Right 50% Column */}
      <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-lg mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4A6B] tracking-tight">
            Daftar Akun Baru
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lengkapi identitas kampus Anda untuk kemudahan verifikasi laporan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Lengkap"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1">
                NIM / NIP
              </label>
              <input
                type="text"
                required
                value={nimOrNip}
                onChange={(e) => setNimOrNip(e.target.value)}
                placeholder="210101030..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1">
                Peran di Kampus
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3] bg-white"
              >
                <option value="Mahasiswa">Mahasiswa</option>
                <option value="Dosen">Dosen</option>
                <option value="Staf Tendik">Staf Tenaga Kependidikan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1">
              Fakultas / Unit
            </label>
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3] bg-white"
            >
              <option value="Fakultas Tarbiyah dan Keguruan">Fakultas Tarbiyah dan Keguruan</option>
              <option value="Fakultas Syariah">Fakultas Syariah</option>
              <option value="Fakultas Ushuluddin dan Humaniora">Fakultas Ushuluddin dan Humaniora</option>
              <option value="Fakultas Dakwah dan Ilmu Komunikasi">Fakultas Dakwah dan Ilmu Komunikasi</option>
              <option value="Fakultas Ekonomi dan Bisnis Islam">Fakultas Ekonomi dan Bisnis Islam (FEBI)</option>
              <option value="Pascasarjana / Unit Pengelola">Pascasarjana / Unit Pengelola</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1">
                Email Kampus
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@uin-antasari.ac.id"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1">
                No. WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxx"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#29A9A3] hover:bg-[#23928d] shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 mt-4"
          >
            <span>{isLoading ? 'Mendaftarkan Akun...' : 'Daftar Akun Civitas Kampus'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-5">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="font-bold text-[#29A9A3] hover:underline">
            Masuk di Sini
          </Link>
        </p>
      </div>
    </div>
  );
}
