'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  MapPin,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Users,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import TitikTemuLogo from '@/components/TitikTemuLogo';
import { setCurrentUser, DEMO_USER } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setCurrentUser({
        id: `user-${Date.now()}`,
        full_name: emailOrPhone.includes('@')
          ? emailOrPhone.split('@')[0]
          : 'Civitas UIN Antasari',
        email: emailOrPhone.includes('@')
          ? emailOrPhone
          : `${emailOrPhone}@uin-antasari.ac.id`,
        phone_number: !emailOrPhone.includes('@') ? emailOrPhone : '081255890123',
        faculty_or_unit: 'Kampus 2 UIN Antasari',
        role: 'Mahasiswa',
        avatar_url:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      });
      setIsLoading(false);
      router.push('/');
    }, 400);
  };

  const handleDemoLogin = (role: 'Mahasiswa' | 'Dosen' | 'Satpam') => {
    setIsLoading(true);
    setTimeout(() => {
      if (role === 'Mahasiswa') {
        setCurrentUser(DEMO_USER);
      } else if (role === 'Dosen') {
        setCurrentUser({
          id: 'user-dosen-fathur',
          full_name: 'Dr. Fathurrahman, M.Ag.',
          email: 'fathurrahman@uin-antasari.ac.id',
          nim_or_nip: '198205122008011015',
          faculty_or_unit: 'Fakultas Syariah & Hukum',
          role: 'Dosen',
          phone_number: '087814552200',
          avatar_url:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        });
      } else {
        setCurrentUser({
          id: 'user-satpam-ahmad',
          full_name: 'Pak Ahmad (Komandan Satpam)',
          email: 'keamanan.kampus2@uin-antasari.ac.id',
          nim_or_nip: 'SAT-UIN-04',
          faculty_or_unit: 'Unit Pengamanan Kampus 2',
          role: 'Satpam Kampus',
          phone_number: '081349887711',
          avatar_url:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        });
      }
      setIsLoading(false);
      router.push('/');
    }, 250);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left 50% Column */}
      <div className="relative bg-[#F4F7F9] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-r border-[#E2E8F0] overflow-hidden">
        {/* Decorative Lines */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M-100 200 C 150 100, 300 400, 600 250 S 900 100, 1200 300"
              fill="none"
              stroke="#1B4A6B"
              strokeWidth="6"
            />
            <circle cx="300" cy="400" r="16" fill="#F2823A" />
            <circle cx="600" cy="250" r="12" fill="#29A9A3" />
          </svg>
        </div>

        <div className="relative z-10">
          <TitikTemuLogo size="lg" showTagline={true} />
        </div>

        {/* Center Headline & Highlights */}
        <div className="relative z-10 my-12 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#1B4A6B] bg-white border border-[#E2E8F0] shadow-sm mb-4">
            <GraduationCap className="w-4 h-4 text-[#29A9A3]" />
            <span>Civitas Akademika Kampus 2 UIN Antasari</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B4A6B] leading-tight mb-4">
            Temukan Kembali Barang Berharga Anda di Kampus 2 UIN Antasari
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
            Platform aman untuk mahasiswa, dosen, dan staf di Kampus 2 Jl. Pandarapan Banjarbaru.
            Dilengkapi sensor otomatis dokumen identitas dan verifikasi rahasia.
          </p>

          {/* Trust Highlights */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#29A9A3]/10 text-[#29A9A3] flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B4A6B]">
                  Perlindungan Bukti Pemilik Sah
                </h4>
                <p className="text-xs text-slate-500">
                  Pertanyaan verifikasi ciri rahasia diajukan sebelum nomor kontak dibagikan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F2823A]/10 text-[#F2823A] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B4A6B]">
                  Terpetakan di Seluruh Zona Kampus 2
                </h4>
                <p className="text-xs text-slate-500">
                  Gedung Kuliah Terpadu, Perpustakaan Pusat, Masjid Kampus, Kantin, dan Parkiran.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1B4A6B]/10 text-[#1B4A6B] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B4A6B]">
                  Sensor Privasi KTM & KTP Otomatis
                </h4>
                <p className="text-xs text-slate-500">
                  Menjaga kerahasiaan NIM dan identitas pribadi mahasiswa dari penyalahgunaan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          📍 Jl. Pandarapan, Kel. Guntung Manggis, Kec. Landasan Ulin, Banjarbaru.
        </div>
      </div>

      {/* Right 50% Column */}
      <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-lg mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4A6B] tracking-tight">
            Masuk Portal Kampus
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gunakan email civitas kampus atau login cepat dengan akun simulasi.
          </p>
        </div>

        {/* Quick Demo Logins for UIN Antasari */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
          <p className="text-xs font-bold text-[#1B4A6B] mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#29A9A3]" />
            <span>Simulasi Masuk Cepat (1-Klik):</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('Mahasiswa')}
              className="p-2 rounded-xl text-xs font-bold text-[#1B4A6B] bg-white border border-slate-200 hover:border-[#1B4A6B] hover:bg-slate-100 transition-all text-center"
            >
              🎓 Mahasiswa
              <span className="block text-[10px] text-slate-400 font-normal">Ahmad Fauzan</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('Dosen')}
              className="p-2 rounded-xl text-xs font-bold text-[#29A9A3] bg-white border border-slate-200 hover:border-[#29A9A3] hover:bg-slate-100 transition-all text-center"
            >
              📚 Dosen
              <span className="block text-[10px] text-slate-400 font-normal">Dr. Fathurrahman</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('Satpam')}
              className="p-2 rounded-xl text-xs font-bold text-amber-700 bg-white border border-slate-200 hover:border-amber-700 hover:bg-slate-100 transition-all text-center"
            >
              🛡️ Satpam
              <span className="block text-[10px] text-slate-400 font-normal">Pos Gerbang</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1.5">
              Email Kampus / NIM / No. WhatsApp
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="nama@uin-antasari.ac.id atau 2101010..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider">
                Kata Sandi
              </label>
              <a href="#" className="text-xs text-[#29A9A3] hover:underline">
                Lupa sandi?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#29A9A3] hover:bg-[#23928d] shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Memproses Masuk...' : 'Masuk ke Portal Titik Temu'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Belum terdaftar?{' '}
          <Link href="/register" className="font-bold text-[#29A9A3] hover:underline">
            Daftar Akun Civitas
          </Link>
        </p>
      </div>
    </div>
  );
}
