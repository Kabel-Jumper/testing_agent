import React from 'react';
import Link from 'next/link';

interface TitikTemuLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  clickable?: boolean;
}

export const TitikTemuLogo: React.FC<TitikTemuLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  clickable = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl tracking-tight',
    lg: 'text-3xl tracking-tight',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon: Two overlapping location pins with orange center dot */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform hover:scale-105 duration-200"
        >
          {/* Left Pin: Primary Dark Blue #1B4A6B */}
          <path
            d="M26 8C17.163 8 10 15.163 10 24C10 35.5 26 52 26 52C26 52 32 45.8 36.2 39.5C31.2 37.1 27.5 32.2 26.5 26.4C26.1 23.9 26 21.4 26.3 19C26.1 19 26 19 26 19L26 8Z"
            fill="#1B4A6B"
            opacity="0.95"
          />
          {/* Right Pin: Primary Teal #29A9A3 with subtle overlay blend */}
          <path
            d="M38 12C29.163 12 22 19.163 22 28C22 39.5 38 56 38 56C38 56 54 39.5 54 28C54 19.163 46.837 12 38 12Z"
            fill="#29A9A3"
          />
          {/* White inner border for definition on intersection */}
          <circle cx="38" cy="28" r="9" fill="#FFFFFF" />
          <circle cx="26" cy="24" r="8" fill="#1B4A6B" opacity="0.3" />

          {/* Warm Orange Center Dot #F2823A */}
          <circle cx="38" cy="28" r="5.5" fill="#F2823A" />
          <circle cx="36.5" cy="26.5" r="1.5" fill="#FFFFFF" opacity="0.8" />
        </svg>
      </div>

      {/* Typography: "titik temu" (titik in #1B4A6B, temu in #29A9A3) */}
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold ${textSizes[size]} font-sans`}>
          <span style={{ color: '#1B4A6B' }}>titik</span>
          <span style={{ color: '#29A9A3' }} className="ml-1">temu</span>
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
          Kampus 2 UIN Antasari
        </span>
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-block group focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
export default TitikTemuLogo;
