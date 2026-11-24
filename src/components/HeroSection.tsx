'use client';

import React from 'react';
import Link from 'next/link';
import { Search, X, PlusCircle, AlertCircle, Compass, GraduationCap } from 'lucide-react';
import { ItemCategory } from '@/types';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ItemCategory | 'Semua';
  onCategoryChange: (category: ItemCategory | 'Semua') => void;
  onOpenReportModal?: (type: 'hilang' | 'ditemukan') => void;
  totalActiveCount?: number;
}

const CAMPUS_CATEGORIES: (ItemCategory | 'Semua')[] = [
  'Semua',
  'KTM & Dokumen',
  'Elektronik & Charger',
  'Kunci & Kendaraan',
  'Buku & Alat Tulis',
  'Tas & Botol Minum',
  'Lainnya',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onOpenReportModal,
  totalActiveCount = 6,
}) => {
  return (
    <section className="relative bg-[#F4F7F9] border-b border-[#E2E8F0] pt-10 pb-12 sm:pt-14 sm:pb-16 overflow-hidden">
      {/* Decorative campus background geometry */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1B4A6B" strokeWidth="1.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#campus-grid)" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Campus Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-sm mb-4">
          <GraduationCap className="w-4 h-4 text-[#29A9A3]" />
          <span className="text-xs font-bold text-[#1B4A6B]">
            Lost & Found Civitas Akademika Kampus 2 UIN Antasari Banjarbaru
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B4A6B] tracking-tight leading-tight sm:leading-tight mb-4">
          Kehilangan Barang di Kampus? <br className="hidden sm:inline" />
          Atau Menemukan Sesuatu?
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
          Platform gotong royong mahasiswa, dosen, dan staf <strong>Kampus 2 UIN Antasari Banjarmasin</strong> (Jl. Pandarapan, Guntung Manggis). Laporkan KTM, kunci, charger, atau buku yang tertinggal dengan sistem verifikasi aman.
        </p>

        {/* Two High-Contrast Side-by-Side Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
          {/* Orange Button: Lapor Kehilangan */}
          <Link
            href="/lapor?type=hilang"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-bold text-white bg-[#F2823A] hover:bg-[#e0712a] shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <AlertCircle className="w-5 h-5 text-white" />
            <span>Lapor Kehilangan Barang</span>
          </Link>

          {/* Teal Button: Lapor Temuan */}
          <Link
            href="/lapor?type=ditemukan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-bold text-white bg-[#29A9A3] hover:bg-[#23928d] shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <PlusCircle className="w-5 h-5 text-white" />
            <span>Lapor Barang Ditemukan</span>
          </Link>

          <Link
            href="/peta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-base font-bold text-[#1B4A6B] bg-white border border-[#E2E8F0] hover:bg-slate-50 transition-all shadow-sm"
          >
            <Compass className="w-5 h-5 text-[#1B4A6B]" />
            <span>Peta Kampus 2</span>
          </Link>
        </div>

        {/* Prominent Live Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari KTM, charger, kunci, lokasi (GKT, Perpus, Masjid Kampus, Parkiran, Kantin)..."
              className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-white border border-[#E2E8F0] text-slate-800 text-sm sm:text-base placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#29A9A3] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Campus Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {CAMPUS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#1B4A6B] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-[#E2E8F0] hover:bg-slate-100 hover:text-[#1B4A6B]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
