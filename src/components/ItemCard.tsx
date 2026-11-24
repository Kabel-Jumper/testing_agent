'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Tag,
  GraduationCap,
} from 'lucide-react';
import { Item } from '@/types';
import { formatRelativeTime, truncateText } from '@/lib/utils';

interface ItemCardProps {
  item: Item;
  isSelected?: boolean;
  onSelect?: (item: Item) => void;
  onClaim?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isSelected = false,
  onSelect,
  onClaim,
}) => {
  const [isBlurred, setIsBlurred] = useState<boolean>(item.is_photo_blurred);

  const isLost = item.type === 'hilang';
  const isResolved = item.status === 'selesai';

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer ${
        isSelected
          ? 'ring-2 ring-[#29A9A3] shadow-lg border-transparent -translate-y-0.5'
          : 'border-[#E2E8F0] hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Media Thumbnail with Privacy Blur & Status Badge */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              isBlurred ? 'filter blur-md scale-110' : 'filter-none'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-4">
            <Tag className="w-10 h-10 mb-1 text-slate-300" />
            <span className="text-xs font-medium">Foto Tidak Tersedia</span>
          </div>
        )}

        {/* Privacy Blur Toggle Button (For sensitive docs like KTM, SIM, ATM) */}
        {item.is_photo_blurred && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsBlurred(!isBlurred);
            }}
            title={isBlurred ? 'Tampilkan foto jelas' : 'Samarkan foto'}
            className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
          >
            {isBlurred ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isBlurred ? 'Buka Sensor' : 'Sensor Privasi'}</span>
          </button>
        )}

        {/* Top-Right Status Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          {isResolved ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Selesai
            </span>
          ) : isLost ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#F2823A] text-white shadow-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Hilang
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#29A9A3] text-white shadow-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Ditemukan
            </span>
          )}
        </div>

        {/* Campus Zone Pill on Top-Left */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-[#1B4A6B] backdrop-blur-sm shadow-sm border border-white/60">
            <GraduationCap className="w-3 h-3 text-[#29A9A3]" />
            <span>{item.campus_zone}</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Timestamp */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-[#1B4A6B] bg-[#1B4A6B]/5 px-2.5 py-0.5 rounded-md">
              {item.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatRelativeTime(item.date_time)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[#1B4A6B] text-base leading-snug line-clamp-2 group-hover:text-[#29A9A3] transition-colors mb-2">
            {item.title}
          </h3>

          {/* Location Pin */}
          <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-3">
            <MapPin className="w-4 h-4 text-[#F2823A] flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">{item.location_name}</span>
          </div>

          {/* Description Snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {truncateText(item.description, 110)}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Security Question Indicator */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#29A9A3]" />
            <span>Verifikasi Rahasia</span>
          </div>

          <Link
            href={`/barang/${item.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#29A9A3] group-hover:text-[#1B4A6B] hover:underline"
          >
            <span>Lihat Detail & Klaim</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ItemCard;
