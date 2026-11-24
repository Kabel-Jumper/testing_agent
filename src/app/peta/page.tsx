'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  MapPin,
  Layers,
  ArrowLeft,
  PlusCircle,
  Eye,
  EyeOff,
  Sparkles,
  Compass,
  GraduationCap,
} from 'lucide-react';
import Navbar, { CAMPUS_ZONES } from '@/components/Navbar';
import LeafletMap from '@/components/Map/LeafletMap';
import { Item, CampusZone } from '@/types';
import { getStoredItems } from '@/lib/store';
import { formatRelativeTime } from '@/lib/utils';

export default function PetaKampusPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedZone, setSelectedZone] = useState<CampusZone>('Semua Area Kampus');
  const [activeType, setActiveType] = useState<'semua' | 'hilang' | 'ditemukan'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    setItems(getStoredItems());
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedZone !== 'Semua Area Kampus' && item.campus_zone !== selectedZone) {
        return false;
      }
      if (activeType === 'hilang' && item.type !== 'hilang') return false;
      if (activeType === 'ditemukan' && item.type !== 'ditemukan') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.location_name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.campus_zone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, selectedZone, activeType, searchQuery]);

  return (
    <div className="h-screen flex flex-col bg-[#F4F7F9] overflow-hidden">
      <Navbar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Sidebar Panel */}
        <div className="w-full md:w-96 lg:w-[420px] bg-white border-r border-[#E2E8F0] flex flex-col z-20 h-auto md:h-full max-h-[40vh] md:max-h-full overflow-hidden shadow-lg md:shadow-none">
          {/* Top Filter Controls */}
          <div className="p-4 border-b border-[#E2E8F0] space-y-3 bg-[#F4F7F9]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#1B4A6B] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#29A9A3]" />
                <span>Peta Kampus 2 UIN Antasari</span>
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1B4A6B]/10 text-[#1B4A6B]">
                {filteredItems.length} Titik
              </span>
            </div>

            {/* Live Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari gedung, perpustakaan, atau barang..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
              />
            </div>

            {/* Campus Zone Selector */}
            <div className="flex flex-wrap gap-1">
              {CAMPUS_ZONES.map((zone) => {
                const isSelected = selectedZone === zone;
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setSelectedZone(zone)}
                    className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                      isSelected
                        ? 'bg-[#1B4A6B] text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {zone}
                  </button>
                );
              })}
            </div>

            {/* Type Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveType('semua')}
                className={`py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeType === 'semua' ? 'bg-[#F4F7F9] text-[#1B4A6B]' : 'text-slate-500'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setActiveType('hilang')}
                className={`py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeType === 'hilang' ? 'bg-[#F2823A] text-white' : 'text-slate-500'
                }`}
              >
                Hilang
              </button>
              <button
                type="button"
                onClick={() => setActiveType('ditemukan')}
                className={`py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeType === 'ditemukan' ? 'bg-[#29A9A3] text-white' : 'text-slate-500'
                }`}
              >
                Ditemukan
              </button>
            </div>
          </div>

          {/* Items Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const isLost = item.type === 'hilang';
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'border-[#29A9A3] bg-[#29A9A3]/5 ring-1 ring-[#29A9A3]'
                      : 'border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {item.photo_url ? (
                    <img
                      src={item.photo_url}
                      alt={item.title}
                      className={`w-16 h-16 rounded-xl object-cover flex-shrink-0 ${
                        item.is_photo_blurred ? 'filter blur-sm' : ''
                      }`}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      No Foto
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'selesai'
                            ? 'bg-emerald-100 text-emerald-700'
                            : isLost
                            ? 'bg-[#F2823A]/15 text-[#F2823A]'
                            : 'bg-[#29A9A3]/15 text-[#29A9A3]'
                        }`}
                      >
                        {item.status === 'selesai' ? 'SELESAI' : isLost ? 'HILANG' : 'DITEMUKAN'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(item.date_time)}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#1B4A6B] truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#F2823A] flex-shrink-0" />
                      <span>{item.location_name}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Full-Canvas Leaflet Map */}
        <div className="flex-1 relative h-full">
          <LeafletMap
            items={filteredItems}
            selectedItemId={selectedItem?.id}
            onSelectItem={(it) => setSelectedItem(it)}
            selectedZone={selectedZone}
            height="100%"
          />

          {/* Floating detail card if an item is selected */}
          {selectedItem && (
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[400] bg-white rounded-3xl p-4 shadow-xl border border-[#E2E8F0] animate-in slide-in-from-bottom-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                    selectedItem.type === 'hilang'
                      ? 'bg-[#F2823A] text-white'
                      : 'bg-[#29A9A3] text-white'
                  }`}
                >
                  {selectedItem.type}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-bold text-sm text-[#1B4A6B] mb-1">{selectedItem.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-1 mb-3">📍 {selectedItem.location_name}</p>

              <Link
                href={`/barang/${selectedItem.id}`}
                className="w-full block text-center py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#29A9A3] hover:bg-[#23928d] transition-all"
              >
                Buka Detail & Klaim Barang →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
