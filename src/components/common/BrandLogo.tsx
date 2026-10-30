import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'md' ? 38 : 48;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Ondeway Geometric Gear & Coffee Bean SVG Mark */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 88 88"
          className="transition-transform hover:rotate-45 duration-700 ease-out"
          aria-hidden="true"
        >
          {/* Outer Gear Teeth in Ondeway Brand Red (#c1352d) */}
          <g transform="translate(44 44)" fill="#c1352d">
            <rect x="-5" y="-34" width="10" height="11" rx="2.6" />
            <rect x="-5" y="23" width="10" height="11" rx="2.6" />
            <rect x="-34" y="-5" width="11" height="10" rx="2.6" />
            <rect x="23" y="-5" width="11" height="10" rx="2.6" />
            <rect x="-5" y="-34" width="10" height="11" rx="2.6" transform="rotate(45)" />
            <rect x="-5" y="23" width="10" height="11" rx="2.6" transform="rotate(45)" />
            <rect x="-34" y="-5" width="11" height="10" rx="2.6" transform="rotate(45)" />
            <rect x="23" y="-5" width="11" height="10" rx="2.6" transform="rotate(45)" />
            <circle cx="0" cy="0" r="26" />
          </g>
          {/* Inner Cream Circle */}
          <circle cx="44" cy="44" r="19.5" fill="#fdf8f0" />
          {/* Coffee Bean Contour in Brand Red */}
          <g transform="translate(44 47) scale(0.66)">
            <ellipse cx="0" cy="0" rx="11.5" ry="15" fill="#c1352d" />
            <path
              d="M0,-13.5 C5.5,-6 5.5,6 0,13.5"
              stroke="#fdf8f0"
              strokeWidth="3.6"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      <div className="leading-tight">
        <div className="flex items-center gap-1.5 font-extrabold tracking-wider text-[#c1352d] dark:text-[#f47167]">
          <span className={size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-xl'}>
            ONDEWAY
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#c1352d]/10 text-[#c1352d] dark:bg-[#c1352d]/20 dark:text-[#f6c4b8] border border-[#c1352d]/20">
            OS
          </span>
        </div>
        {showSubtitle && (
          <div className="text-[11px] font-medium tracking-tight text-[#7a5c4b] dark:text-[#e7dacb]/80">
            Coffee Company · BizDash
          </div>
        )}
      </div>
    </div>
  );
};
