'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  PlusCircle,
  LogIn,
  User,
  LogOut,
  ChevronDown,
  Compass,
  HelpCircle,
  Home,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import TitikTemuLogo from './TitikTemuLogo';
import { CampusZone } from '@/types';
import { getCurrentUser, setCurrentUser, DEMO_USER } from '@/lib/store';

export const CAMPUS_ZONES: CampusZone[] = [
  'Semua Area Kampus',
  'Gedung Kuliah / Fakultas',
  'Perpustakaan Pusat',
  'Masjid Kampus',
  'Kantin & Taman',
  'Area Parkir & Gerbang',
];

interface NavbarProps {
  selectedZone?: CampusZone;
  onSelectZone?: (zone: CampusZone) => void;
  onOpenReportModal?: (type?: 'hilang' | 'ditemukan') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedZone = 'Semua Area Kampus',
  onSelectZone,
  onOpenReportModal,
}) => {
  const pathname = usePathname();
  const [user, setUser] = useState(getCurrentUser());
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleUserUpdate = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('titik-temu-user-updated', handleUserUpdate);
    return () => {
      window.removeEventListener('titik-temu-user-updated', handleUserUpdate);
    };
  }, []);

  const handleZoneSelect = (zone: CampusZone) => {
    if (onSelectZone) {
      onSelectZone(zone);
    }
    setIsZoneDropdownOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsUserMenuOpen(false);
  };

  const handleLoginDemo = () => {
    setCurrentUser(DEMO_USER);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          {/* Left: Logo & Campus Zone Pill */}
          <div className="flex items-center gap-2 sm:gap-5 flex-shrink-0">
            <TitikTemuLogo size="md" showTagline={true} />

            {/* Campus Zone Pill Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsZoneDropdownOpen(!isZoneDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F4F7F9] hover:bg-slate-200/80 text-[#1B4A6B] border border-[#E2E8F0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#29A9A3]/30"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F2823A] flex-shrink-0" />
                <span className="max-w-[130px] sm:max-w-[180px] truncate">
                  {selectedZone}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                    isZoneDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isZoneDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Zona Kampus 2 UIN Antasari
                  </div>
                  {CAMPUS_ZONES.map((zone) => {
                    const isSelected = selectedZone === zone;
                    return (
                      <button
                        key={zone}
                        onClick={() => handleZoneSelect(zone)}
                        className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-[#F4F7F9] transition-colors ${
                          isSelected
                            ? 'font-bold text-[#1B4A6B] bg-[#F4F7F9]'
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-[#29A9A3]' : 'bg-slate-300'
                            }`}
                          />
                          <span>{zone}</span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#29A9A3]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'bg-[#1B4A6B]/10 text-[#1B4A6B]'
                  : 'text-slate-600 hover:text-[#1B4A6B] hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </Link>
            <Link
              href="/peta"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === '/peta'
                  ? 'bg-[#1B4A6B]/10 text-[#1B4A6B]'
                  : 'text-slate-600 hover:text-[#1B4A6B] hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Peta Kampus 2</span>
            </Link>
            <Link
              href="/cara-kerja"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === '/cara-kerja'
                  ? 'bg-[#1B4A6B]/10 text-[#1B4A6B]'
                  : 'text-slate-600 hover:text-[#1B4A6B] hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Panduan</span>
            </Link>
          </nav>

          {/* Right: Quick Report & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Action Button for Lapor */}
            <Link
              href="/lapor"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#F2823A] hover:bg-[#e0712a] shadow-sm transition-all hover:shadow active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Lapor Barang</span>
              <span className="sm:hidden">Lapor</span>
            </Link>

            {/* Auth Button or User Menu */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="inline-flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-[#E2E8F0] hover:bg-[#F4F7F9] transition-colors focus:outline-none"
                >
                  <img
                    src={
                      user.avatar_url ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'
                    }
                    alt={user.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-[#29A9A3]"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[110px] truncate">
                    {user.full_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400">Masuk sebagai</p>
                      <p className="text-sm font-bold text-[#1B4A6B] truncate">
                        {user.full_name}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                        🎓 {user.role || 'Mahasiswa'} • {user.faculty_or_unit || 'UIN Antasari'}
                      </span>
                    </div>

                    <Link
                      href="/"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-[#F4F7F9] flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Laporan Saya</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 mt-1 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#29A9A3] hover:bg-[#23928d] transition-all shadow-sm active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Akun</span>
                </Link>
                {/* Fast One-Click Demo Mode button for Campus */}
                <button
                  type="button"
                  onClick={handleLoginDemo}
                  title="Masuk simulasi mahasiswa UIN Antasari"
                  className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-[#1B4A6B] bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#29A9A3]" />
                  <span>Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
