'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Eye,
  EyeOff,
  ShieldCheck,
  Share2,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowLeft,
  MessageSquare,
  HelpCircle,
  Phone,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import LeafletMap from '@/components/Map/LeafletMap';
import ClaimModal from '@/components/ClaimModal';
import { Item } from '@/types';
import {
  getItemById,
  updateItemStatus,
  getCurrentUser,
  getClaimsByItemId,
} from '@/lib/store';
import { formatFullIndonesianDate, formatRelativeTime, formatWhatsAppUrl } from '@/lib/utils';

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const id = resolvedParams.id;

  const [item, setItem] = useState<Item | undefined>(undefined);
  const [isPhotoBlurred, setIsPhotoBlurred] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [claimsCount, setClaimsCount] = useState(0);

  useEffect(() => {
    const it = getItemById(id);
    if (it) {
      setItem(it);
      setIsPhotoBlurred(it.is_photo_blurred);
      setClaimsCount(getClaimsByItemId(it.id).length);
    }
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F4F7F9]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-xl font-bold text-[#1B4A6B] mb-2">Barang Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mb-6">
            Laporan barang di Kampus 2 UIN Antasari mungkin telah dihapus atau tautan tidak valid.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#29A9A3]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Kampus</span>
          </Link>
        </div>
      </div>
    );
  }

  const isLost = item.type === 'hilang';
  const isResolved = item.status === 'selesai';

  const handleMarkResolved = () => {
    if (confirm('Tandai barang ini sebagai sudah berhasil bertemu dan selesai serah terima?')) {
      updateItemStatus(item.id, 'selesai');
      setItem({ ...item, status: 'selesai' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${item.title} - titik temu UIN Antasari`,
        text: `Informasi barang ${item.type} di ${item.location_name} (Kampus 2 UIN Antasari): ${item.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9]">
      <Navbar selectedZone={item.campus_zone} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1B4A6B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Barang</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-[#29A9A3]" />
            <span>{copiedLink ? 'Tautan Disalin!' : 'Bagikan Info Ini'}</span>
          </button>
        </div>

        {/* Resolved Alert Banner */}
        {isResolved && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold">Alhamdulillah, Barang Ini Sudah Kembali!</h4>
                <p className="text-xs text-emerald-700">
                  Pemilik sah dan penemu telah berhasil menyelesaikan serah terima barang di Kampus 2 UIN Antasari.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-600 text-white rounded-full">
              Selesai
            </span>
          </div>
        )}

        {/* Main Grid: Details / Actions & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                {item.photo_url ? (
                  <img
                    src={item.photo_url}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isPhotoBlurred ? 'filter blur-md scale-105' : 'filter-none'
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Foto tidak tersedia
                  </div>
                )}

                {/* Privacy Blur Toggle */}
                {item.is_photo_blurred && (
                  <button
                    type="button"
                    onClick={() => setIsPhotoBlurred(!isPhotoBlurred)}
                    className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all shadow"
                  >
                    {isPhotoBlurred ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>{isPhotoBlurred ? 'Lihat Foto Jelas' : 'Sensor Privasi Aktif'}</span>
                  </button>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 right-4 z-10">
                  {isResolved ? (
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-md uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Selesai Bertemu
                    </span>
                  ) : isLost ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#F2823A] text-white shadow-md uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Barang Hilang
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#29A9A3] text-white shadow-md uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      Barang Ditemukan
                    </span>
                  )}
                </div>

                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#1B4A6B] backdrop-blur-sm shadow border border-white/50">
                    <GraduationCap className="w-3.5 h-3.5 text-[#29A9A3]" />
                    <span>{item.campus_zone}</span>
                  </span>
                </div>
              </div>

              {/* Title & Core Information */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-bold text-[#1B4A6B] bg-[#1B4A6B]/5 px-3 py-1 rounded-lg">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {formatRelativeTime(item.date_time)}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4A6B] leading-tight mb-4">
                  {item.title}
                </h1>

                {/* Key metadata grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F4F7F9] border border-slate-200/80 mb-6">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      Lokasi di Kampus 2
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-start gap-1.5 mt-0.5">
                      <MapPin className="w-4 h-4 text-[#F2823A] flex-shrink-0 mt-0.5" />
                      <span>{item.location_name}</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      Waktu Tercecer / Ditemukan
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-[#29A9A3] flex-shrink-0" />
                      <span>{formatFullIndonesianDate(item.date_time)}</span>
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-2">
                    Deskripsi Lengkap
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                {/* Security Verification Notice */}
                <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#F2823A] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase">
                      Sistem Verifikasi Pemilik Kampus
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Laporan ini memiliki Pertanyaan Verifikasi Keamanan. Siapa pun yang mengklaim
                      barang wajib menjawab ciri spesifik (misal: NIM di KTM, catatan di buku, atau stiker rahasia) sebelum kontak langsung pelapor dibuka.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Campus Map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Action Box Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#1B4A6B] uppercase tracking-wider">
                Aksi Serah Terima Kampus
              </h3>

              {!isResolved ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsClaimModalOpen(true)}
                    className="w-full py-4 px-5 rounded-2xl text-base font-bold text-white bg-[#29A9A3] hover:bg-[#23928d] transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>
                      {isLost ? 'Saya Menemukannya!' : 'Ini Barang Saya! (Klaim)'}
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    Jawab pertanyaan verifikasi keamanan dari pelapor untuk membuka nomor WhatsApp.
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleMarkResolved}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Tandai Sudah Bertemu (Selesai)</span>
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-1">
                      Klik ini jika Anda pelapor dan barang sudah diterima kembali.
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-sm font-bold text-emerald-900">Status: Selesai</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Laporan ini sudah ditandai selesai dan ditutup.
                  </p>
                </div>
              )}
            </div>

            {/* Reporter Profile Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Informasi Pelapor
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1B4A6B]/10 text-[#1B4A6B] flex items-center justify-center font-bold text-base">
                  {item.reporter_name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B4A6B]">{item.reporter_name}</h4>
                  <p className="text-xs text-slate-500">
                    {item.reporter_role || 'Civitas Akademika Kampus 2'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Status Kontak:</span>
                <span className="font-semibold text-slate-700">Terkunci (Perlu Verifikasi)</span>
              </div>
            </div>

            {/* Location Map Pin Box */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1B4A6B] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#F2823A]" />
                  <span>Lokasi di Peta Kampus 2</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                </span>
              </div>

              <div className="h-[260px] w-full rounded-2xl overflow-hidden border border-slate-200">
                <LeafletMap
                  items={[item]}
                  selectedItemId={item.id}
                  selectedZone={item.campus_zone}
                  height="100%"
                />
              </div>

              <p className="text-xs text-slate-500 italic text-center">
                📍 {item.location_name} • Kampus 2 UIN Antasari
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Claim Modal */}
      <ClaimModal
        item={item}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSuccess={() => {
          setClaimsCount((prev) => prev + 1);
        }}
      />
    </div>
  );
}
