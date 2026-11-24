'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { CampusZone } from '@/types';
import { Loader2 } from 'lucide-react';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  campusZone?: CampusZone;
  onChangeCoordinates: (lat: number, lng: number) => void;
  height?: string;
}

const DynamicLocationPicker = dynamic(
  () => import('./LocationPickerMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-[#E2E8F0] text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 text-[#29A9A3] animate-spin" />
        <span className="text-xs font-semibold text-slate-500">
          Memuat Pemilih Titik Kampus 2 UIN Antasari...
        </span>
      </div>
    ),
  }
);

export const LocationPickerMap: React.FC<LocationPickerMapProps> = (props) => {
  return <DynamicLocationPicker {...props} />;
};

export default LocationPickerMap;
