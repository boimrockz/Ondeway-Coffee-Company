import React from 'react';
import { Palette, Printer, Type, Check, Sparkles, Layers } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const DesignSystemGuide: React.FC = () => {
  const brandColors = [
    { name: 'Brand Red (Logo)', hex: '#c1352d', desc: 'Warna utama logo dan penekanan aksi' },
    { name: 'Brand Dark Red', hex: '#8b2320', desc: 'Hover state & batas kontras tinggi' },
    { name: 'Clay Terracotta', hex: '#cf7440', desc: 'Aksen hangat roastery & kebun kopi' },
    { name: 'Amber Roast', hex: '#f0b429', desc: 'Peringatan & metrik KPI pencapaian' },
    { name: 'Coffee Dark', hex: '#2a1a15', desc: 'Teks gelap & latar mode gelap #160f0c' },
    { name: 'Artisan Cream', hex: '#fdf8f0', desc: 'Latar kanvas hangat aplikasi dan kartu' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#c1352d]/10 via-[#c1352d]/5 to-transparent border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c1352d] mb-1">
            <Palette className="w-4 h-4" />
            <span>Ondeway Design System v2</span>
          </div>
          <h2 className="text-xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
            Pedoman Visual & Spesifikasi Token
          </h2>
          <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1 max-w-xl">
            Sistem desain resmi Ondeway Coffee Company. Digunakan di seluruh modul POS, stok bahan
            baku, laporan keuangan, dan cetak struk thermal.
          </p>
        </div>
        <BrandLogo size="lg" />
      </div>

      {/* 1. Color Palette */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-[#2a1a15] dark:text-[#fdf8f0] pb-2 border-b">
          1. Palet Warna Primitif & Semantik
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {brandColors.map(c => (
            <div
              key={c.hex}
              className="rounded-xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 overflow-hidden shadow-2xs"
            >
              <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
              <div className="p-2.5 bg-[#fdf8f0] dark:bg-[#251b16] text-xs">
                <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] text-[11px] truncate">
                  {c.name}
                </div>
                <div className="font-mono text-[10px] text-[#c1352d] font-semibold mt-0.5">
                  {c.hex}
                </div>
                <div className="text-[9px] text-gray-500 line-clamp-2 mt-1">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Typography & Fonts */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-3">
        <h3 className="text-sm font-extrabold text-[#2a1a15] dark:text-[#fdf8f0] pb-2 border-b">
          2. Tipografi & Hierarki Font
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-500">
              Font Primer (Plus Jakarta Sans)
            </span>
            <div className="text-2xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
              Ondeway Artisanal Roastery
            </div>
            <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 leading-relaxed">
              Digunakan untuk semua teks navigasi, tombol, judul kartu, formulir pesanan, dan tabel
              laporan bisnis.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 space-y-2 font-mono">
            <span className="text-[10px] uppercase font-bold text-gray-500 font-sans">
              Font Monospace (JetBrains Mono / ESC/POS)
            </span>
            <div className="text-lg font-bold text-[#c1352d]">ODW-261029-001 Rp 75.000</div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
              Digunakan untuk nomor invoice, struk thermal kasir 58mm/80mm, kode QRIS, dan kode
              voucher promo.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Thermal Printer ESC/POS Guidelines */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-3 text-xs">
        <h3 className="text-sm font-extrabold text-[#2a1a15] dark:text-[#fdf8f0] pb-2 border-b flex items-center gap-2">
          <Printer className="w-4 h-4 text-[#c1352d]" />
          <span>3. Standar Cetak Thermal Struk Kasir (ESC/POS)</span>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Sistem kasir Ondeway mendukung dua format standar printer thermal:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1">
            <div className="font-bold text-xs text-[#c1352d]">Format Lebar 58 mm (32 Kolom)</div>
            <div className="text-[11px] text-gray-500">
              Ideal untuk printer thermal Bluetooth portabel kasir mobile & cetak struk cepat di meja
              kasir ringkas.
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1">
            <div className="font-bold text-xs text-[#c1352d]">Format Lebar 80 mm (48 Kolom)</div>
            <div className="text-[11px] text-gray-500">
              Ideal untuk tiket pesanan dapur (KOT), pesanan B2B dengan banyak baris item, dan printer
              kasir desktop Epson/Sunmi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
