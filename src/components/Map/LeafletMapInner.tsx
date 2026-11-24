'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Item, CampusZone, CAMPUS_ZONE_COORDINATES } from '@/types';
import { truncateText } from '@/lib/utils';

interface LeafletMapInnerProps {
  items: Item[];
  selectedItemId?: string;
  onSelectItem?: (item: Item) => void;
  selectedZone?: CampusZone;
  height?: string;
  interactive?: boolean;
}

export const LeafletMapInner: React.FC<LeafletMapInnerProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  selectedZone = 'Semua Area Kampus',
  height = '100%',
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Custom SVG Markers
  const createCustomIcon = (type: string, status: string, isSelected: boolean) => {
    const isLost = type === 'hilang';
    const isResolved = status === 'selesai';

    const color = isResolved ? '#10B981' : isLost ? '#F2823A' : '#29A9A3';
    const borderColor = isSelected ? '#1B4A6B' : '#FFFFFF';
    const scale = isSelected ? 'scale(1.25)' : 'scale(1)';

    const svgHtml = `
      <div style="transform: ${scale}; transition: transform 0.2s ease; position: relative;">
        ${
          isSelected
            ? `<div style="position: absolute; top: -8px; left: -8px; width: 50px; height: 50px; border-radius: 50%; background: ${color}44; animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
            : ''
        }
        <svg width="36" height="44" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="${color}" stroke="${borderColor}" stroke-width="${
      isSelected ? '3' : '2'
    }"/>
          <circle cx="17" cy="17" r="7" fill="#FFFFFF"/>
          <circle cx="17" cy="17" r="4" fill="${color}"/>
        </svg>
      </div>
    `;

    return L.divIcon({
      html: svgHtml,
      className: 'custom-leaflet-marker',
      iconSize: [36, 44],
      iconAnchor: [18, 44],
      popupAnchor: [0, -40],
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initial =
      CAMPUS_ZONE_COORDINATES[selectedZone] ||
      CAMPUS_ZONE_COORDINATES['Semua Area Kampus'];

    const map = L.map(mapContainerRef.current, {
      center: initial.center,
      zoom: initial.zoom,
      zoomControl: interactive,
      attributionControl: false,
      scrollWheelZoom: interactive,
      maxZoom: 19,
      minZoom: 14,
    });

    // High detail OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control
      .attribution({
        prefix:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | UIN Antasari Kampus 2',
        position: 'bottomright',
      })
      .addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersGroupRef.current = markersGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Fly to campus zones when selectedZone changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const target = CAMPUS_ZONE_COORDINATES[selectedZone];
    if (target) {
      map.flyTo(target.center, target.zoom, { duration: 1.2 });
    }
  }, [selectedZone]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    items.forEach((item) => {
      const isSelected = item.id === selectedItemId;
      const icon = createCustomIcon(item.type, item.status, isSelected);

      const marker = L.marker([item.latitude, item.longitude], { icon });

      marker.on('click', () => {
        if (onSelectItem) {
          onSelectItem(item);
        }
      });

      const isLost = item.type === 'hilang';
      const badgeColor =
        item.status === 'selesai' ? '#10B981' : isLost ? '#F2823A' : '#29A9A3';
      const badgeLabel =
        item.status === 'selesai' ? 'SELESAI' : isLost ? 'HILANG' : 'DITEMUKAN';

      const popupHtml = `
        <div style="font-family: inherit; width: 220px; padding: 2px;">
          ${
            item.photo_url
              ? `<div style="position: relative; height: 100px; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
                  <img src="${item.photo_url}" style="width: 100%; height: 100%; object-fit: cover; ${
                  item.is_photo_blurred ? 'filter: blur(4px);' : ''
                }" />
                  <span style="position: absolute; top: 6px; right: 6px; font-size: 10px; font-weight: bold; background: ${badgeColor}; color: white; padding: 2px 8px; border-radius: 9999px;">
                    ${badgeLabel}
                  </span>
                </div>`
              : `<div style="margin-bottom: 6px;"><span style="font-size: 10px; font-weight: bold; background: ${badgeColor}; color: white; padding: 2px 8px; border-radius: 9999px;">${badgeLabel}</span></div>`
          }
          <h4 style="font-weight: 700; color: #1B4A6B; font-size: 13px; margin: 0 0 4px 0; line-height: 1.3;">
            ${item.title}
          </h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.3;">
            📍 ${truncateText(item.location_name, 45)}
          </p>
          <a href="/barang/${item.id}" style="display: block; text-align: center; background: #29A9A3; color: white; font-weight: 700; font-size: 11px; padding: 6px 10px; border-radius: 6px; text-decoration: none;">
            Lihat Detail & Klaim →
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 240,
        className: 'custom-popup-styled',
      });

      markersGroup.addLayer(marker);

      if (isSelected) {
        marker.openPopup();
        map.flyTo([item.latitude, item.longitude], 18, { duration: 0.8 });
      }
    });
  }, [items, selectedItemId]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Floating Campus Map Legend */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2.5 rounded-2xl shadow-md border border-[#E2E8F0] text-xs">
        <div className="font-extrabold text-[#1B4A6B] mb-1.5 flex items-center gap-1.5">
          <span>🏛️ Peta Kampus 2 UIN Antasari</span>
        </div>
        <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F2823A] border border-white"></span>
            <span>Barang Hilang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#29A9A3] border border-white"></span>
            <span>Barang Ditemukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
            <span>Sudah Bertemu (Selesai)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeafletMapInner;
