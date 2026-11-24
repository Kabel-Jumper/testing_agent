'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Item, CampusZone } from '@/types';
import { Loader2 } from 'lucide-react';

interface LeafletMapProps {
  items: Item[];
  selectedItemId?: string;
  onSelectItem?: (item: Item) => void;
  selectedZone?: CampusZone;
  height?: string;
  interactive?: boolean;
}

const DynamicLeafletMap = dynamic(
  () => import('./LeafletMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-[#E2E8F0] text-slate-400 gap-2">
        <Loader2 className="w-7 h-7 text-[#29A9A3] animate-spin" />
        <span className="text-xs font-semibold text-slate-500">
          Memuat Peta Kampus 2 UIN Antasari Banjarbaru...
        </span>
      </div>
    ),
  }
);

export const LeafletMap: React.FC<LeafletMapProps> = (props) => {
  return <DynamicLeafletMap {...props} />;
};

export default LeafletMap;
