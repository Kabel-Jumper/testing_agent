'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  AlertCircle,
  PlusCircle,
  Sparkles,
  MapPin,
  RefreshCw,
  Layers,
  Inbox,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import Navbar, { CAMPUS_ZONES } from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ItemCard from '@/components/ItemCard';
import LeafletMap from '@/components/Map/LeafletMap';
import ClaimModal from '@/components/ClaimModal';
import { Item, ItemType, ItemCategory, CampusZone } from '@/types';
import { getStoredItems } from '@/lib/store';
import Link from 'next/link';

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedZone, setSelectedZone] = useState<CampusZone>('Semua Area Kampus');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'Semua'>('Semua');
  const [activeTab, setActiveTab] = useState<'semua' | 'hilang' | 'ditemukan'>('semua');
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);
  const [claimingItem, setClaimingItem] = useState<Item | null>(null);

  useEffect(() => {
    const loadItems = () => {
      setItems(getStoredItems());
    };

    loadItems();
    window.addEventListener('titik-temu-items-updated', loadItems);
    return () => {
      window.removeEventListener('titik-temu-items-updated', loadItems);
    };
  }, []);

  // Filter items based on Campus Zone, Category, Tab, and Search Query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Zone filter
      if (selectedZone !== 'Semua Area Kampus' && item.campus_zone !== selectedZone) {
        return false;
      }

      // Tab filter (type)
      if (activeTab === 'hilang' && item.type !== 'hilang') return false;
      if (activeTab === 'ditemukan' && item.type !== 'ditemukan') return false;

      // Category filter
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
      }

      // Search keyword
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLoc = item.location_name.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesZone = item.campus_zone.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesLoc || matchesCat || matchesZone;
      }

      return true;
    });
  }, [items, selectedZone, activeTab, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = items.length;
    const lost = items.filter((i) => i.type === 'hilang' && i.status === 'aktif').length;
    const found = items.filter((i) => i.type === 'ditemukan' && i.status === 'aktif').length;
    const resolved = items.filter((i) => i.status === 'selesai').length;
    return { total, lost, found, resolved };
  }, [items]);

  const handleCardSelect = (item: Item) => {
    setSelectedItemId(item.id);
  };

  const handleMapPinSelect = (item: Item) => {
    setSelectedItemId(item.id);
    const cardEl = document.getElementById(`item-card-${item.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F9]">
      <Navbar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalActiveCount={stats.lost + stats.found}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B4A6B]/10 flex items-center justify-center text-[#1B4A6B]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">Laporan Kampus</p>
              <p className="text-xl font-bold text-[#1B4A6B]">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2823A]/10 flex items-center justify-center text-[#F2823A]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">Barang Hilang</p>
              <p className="text-xl font-bold text-[#F2823A]">{stats.lost}</p>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#29A9A3]/10 flex items-center justify-center text-[#29A9A3]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">Ditemukan</p>
              <p className="text-xl font-bold text-[#29A9A3]">{stats.found}</p>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">Sudah Kembali</p>
              <p className="text-xl font-bold text-emerald-600">{stats.resolved}</p>
            </div>
          </div>
        </div>

        {/* Split-View Main Feed: 65% Left Grid / 35% Right Sticky Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (65% / 7.8 columns ~ 7 of 12 or 8 of 12) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            {/* Filter Tabs Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
              {/* Type Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F4F7F9] rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('semua')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'semua'
                      ? 'bg-white text-[#1B4A6B] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({filteredItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('hilang')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'hilang'
                      ? 'bg-[#F2823A] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#F2823A]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white sm:inline-block hidden"></span>
                  Hilang
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ditemukan')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'ditemukan'
                      ? 'bg-[#29A9A3] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#29A9A3]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white sm:inline-block hidden"></span>
                  Ditemukan
                </button>
              </div>

              {/* Status and Active Indicators */}
              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500">
                <span>
                  Menampilkan{' '}
                  <strong className="text-[#1B4A6B]">{filteredItems.length}</strong> barang di{' '}
                  <strong className="text-[#1B4A6B]">{selectedZone}</strong>
                </span>
              </div>
            </div>

            {/* 2-Column Responsive Grid of Item Cards */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredItems.map((item) => (
                  <div id={`item-card-${item.id}`} key={item.id}>
                    <ItemCard
                      item={item}
                      isSelected={item.id === selectedItemId}
                      onSelect={handleCardSelect}
                      onClaim={() => setClaimingItem(item)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="bg-white rounded-3xl border border-[#E2E8F0] p-10 text-center flex flex-col items-center justify-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-[#1B4A6B] mb-1">
                  Tidak Ada Barang di Zona Ini
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
                  Tidak menemukan barang di area "{selectedZone}" dengan kata kunci "{searchQuery || selectedCategory}".
                  Coba ubah kata kunci atau buat laporan barang hilang / temuan sekarang.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                      setSelectedZone('Semua Area Kampus');
                      setActiveTab('semua');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tampilkan Semua Area</span>
                  </button>
                  <Link
                    href="/lapor"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#F2823A] hover:bg-[#e0712a] transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Lapor Barang Baru</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Interactive Leaflet Map for Kampus 2 UIN Antasari */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#F2823A]" />
                  <h3 className="text-sm font-bold text-[#1B4A6B]">
                    Peta Kampus 2 UIN Antasari
                  </h3>
                </div>
                <Link
                  href="/peta"
                  className="text-xs font-bold text-[#29A9A3] hover:underline flex items-center gap-1"
                >
                  <span>Layar Penuh</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Leaflet Map Component with Zoom 16-17 */}
              <div className="h-[460px] xl:h-[500px] w-full rounded-2xl overflow-hidden relative">
                <LeafletMap
                  items={filteredItems}
                  selectedItemId={selectedItemId}
                  onSelectItem={handleMapPinSelect}
                  selectedZone={selectedZone}
                  height="100%"
                />
              </div>

              {/* Quick Campus Zone Switch Buttons directly under map */}
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {CAMPUS_ZONES.map((zone) => {
                  const isSelected = selectedZone === zone;
                  return (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className={`py-1.5 px-1.5 rounded-xl text-[11px] font-bold border transition-all text-center truncate ${
                        isSelected
                          ? 'bg-[#1B4A6B] text-white border-[#1B4A6B]'
                          : 'bg-[#F4F7F9] text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={zone}
                    >
                      {zone.replace('Kampus', '').trim()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Local Campus Security Notice */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 leading-relaxed">
              <p className="font-bold mb-1 flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Titik Temu Aman di Kampus 2 UIN Antasari</span>
              </p>
              Serah terima barang disarankan dilakukan di <strong>Meja Layanan Perpustakaan Pusat</strong>,{' '}
              <strong>Pos Satpam Gerbang Masuk Jl. Pandarapan</strong>, atau di <strong>Kantor Bagian Akademik Fakultas</strong>.
            </div>
          </div>
        </div>
      </main>

      {/* Claim Modal */}
      {claimingItem && (
        <ClaimModal
          item={claimingItem}
          isOpen={Boolean(claimingItem)}
          onClose={() => setClaimingItem(null)}
          onSuccess={() => {
            setItems(getStoredItems());
          }}
        />
      )}

      {/* Campus Footer */}
      <footer className="mt-16 bg-white border-t border-[#E2E8F0] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 <strong>titik temu</strong> — Platform Lost & Found Kampus 2 UIN Antasari Banjarmasin di Banjarbaru.</p>
          <div className="flex items-center gap-4">
            <Link href="/cara-kerja" className="hover:text-[#1B4A6B]">Panduan Mahasiswa</Link>
            <Link href="/peta" className="hover:text-[#1B4A6B]">Peta Kampus</Link>
            <Link href="/lapor" className="hover:text-[#F2823A] font-bold">Lapor Barang</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
