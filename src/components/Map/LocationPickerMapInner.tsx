'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CampusZone, CAMPUS_CENTER, CAMPUS_DEFAULT_ZOOM } from '@/types';
import { MapPin, Navigation } from 'lucide-react';

interface LocationPickerMapInnerProps {
  latitude: number;
  longitude: number;
  campusZone?: CampusZone;
  onChangeCoordinates: (lat: number, lng: number) => void;
  height?: string;
}

export const LocationPickerMapInner: React.FC<LocationPickerMapInnerProps> = ({
  latitude,
  longitude,
  campusZone,
  onChangeCoordinates,
  height = '350px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // State koordinat pusat peta real-time
  const [currentMapCenter, setCurrentMapCenter] = useState<[number, number]>(CAMPUS_CENTER);
  const [currentZoom, setCurrentZoom] = useState<number>(CAMPUS_DEFAULT_ZOOM);

  const createPickerIcon = () => {
    const svgHtml = `
      <div style="position: relative; cursor: grab;">
        <svg width="36" height="46" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="#F2823A" stroke="#FFFFFF" stroke-width="2.5"/>
          <circle cx="17" cy="17" r="7" fill="#FFFFFF"/>
          <circle cx="17" cy="17" r="4" fill="#1B4A6B"/>
        </svg>
      </div>
    `;

    return L.divIcon({
      html: svgHtml,
      className: 'picker-leaflet-marker',
      iconSize: [36, 46],
      iconAnchor: [18, 46],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Pastikan urutan [latitude, longitude]
    const initialLat =
      latitude && !isNaN(latitude) ? latitude : CAMPUS_CENTER[0]; // -3.47118
    const initialLng =
      longitude && !isNaN(longitude) ? longitude : CAMPUS_CENTER[1]; // 114.80194

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: CAMPUS_DEFAULT_ZOOM,
      maxZoom: 19,
      minZoom: 13,
      scrollWheelZoom: true,
      attributionControl: false,
      // maxBounds dimatikan agar map tidak terdorong/meleset dari titik kampus
    });

    // Panggil setView eksplisit di [-3.47118, 114.80194]
    map.setView([initialLat, initialLng], CAMPUS_DEFAULT_ZOOM);

    // TileLayer OpenStreetMap Asli
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    const icon = createPickerIcon();
    const marker = L.marker([initialLat, initialLng], {
      icon,
      draggable: true,
      autoPan: true,
    }).addTo(map);

    // Event geser pin (dragend)
    marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      onChangeCoordinates(position.lat, position.lng);
    });

    // Event klik pada peta: Menempatkan pin ke titik yang diklik pengguna
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChangeCoordinates(lat, lng);
    });

    // Event pemantau pergerakan pusat peta
    map.on('move', () => {
      const c = map.getCenter();
      setCurrentMapCenter([c.lat, c.lng]);
    });

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidate size agar tidak ada pergeseran rendering
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
        map.setView([initialLat, initialLng], CAMPUS_DEFAULT_ZOOM);
      }
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sinkronisasi perubahan dari tombol preset
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
    if (mapInstanceRef.current && latitude && longitude) {
      mapInstanceRef.current.panTo([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Tombol reset view ke titik pusat Kampus 2 UIN Antasari
  const handleResetToCampusCenter = () => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    if (map && marker) {
      marker.setLatLng(CAMPUS_CENTER);
      map.setView(CAMPUS_CENTER, CAMPUS_DEFAULT_ZOOM);
      onChangeCoordinates(CAMPUS_CENTER[0], CAMPUS_CENTER[1]);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Tombol Re-center ke Kampus 2 */}
      <button
        type="button"
        onClick={handleResetToCampusCenter}
        className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-[#1B4A6B] shadow-md border border-[#E2E8F0] hover:bg-[#29A9A3] hover:text-white transition-colors flex items-center gap-1.5"
      >
        <Navigation className="w-3.5 h-3.5" />
        <span>Reset ke Pusat Kampus 2</span>
      </button>

      {/* INDIKATOR KOORDINAT AKTIF DI POJOK BAWAH PETA */}
      <div className="absolute bottom-2 left-2 right-2 z-[400] bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#F2823A] flex-shrink-0 animate-bounce" />
          <span className="font-semibold text-slate-200">
            Pin Terpilih:
            <strong className="text-emerald-400 font-mono ml-1.5">
              [{latitude.toFixed(5)}, {longitude.toFixed(5)}]
            </strong>
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Pusat Peta: [{currentMapCenter[0].toFixed(5)}, {currentMapCenter[1].toFixed(5)}] (Zoom:{' '}
          {currentZoom})
        </div>
      </div>
    </div>
  );
};
export default LocationPickerMapInner;
