'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CampusZone } from '@/types';
import { MapPin } from 'lucide-react';

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
  height = '320px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const createPickerIcon = () => {
    const svgHtml = `
      <div style="position: relative;">
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

    const map = L.map(mapContainerRef.current, {
      center: [latitude || -3.4835, longitude || 114.8425],
      zoom: 17,
      maxZoom: 19,
      minZoom: 15,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const icon = createPickerIcon();
    const marker = L.marker([latitude, longitude], {
      icon,
      draggable: true,
    }).addTo(map);

    marker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      onChangeCoordinates(position.lat, position.lng);
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChangeCoordinates(lat, lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0]">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl text-xs text-slate-700 shadow border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium">
          <MapPin className="w-3.5 h-3.5 text-[#F2823A]" />
          <span>Klik lokasi di Kampus 2 UIN Antasari</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </span>
      </div>
    </div>
  );
};
export default LocationPickerMapInner;
