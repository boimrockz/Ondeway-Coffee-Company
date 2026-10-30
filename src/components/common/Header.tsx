import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Store,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    currentOutlet,
    setCurrentOutlet,
    outlets,
    cashierName,
    currentShift,
    cart,
    cartTotal,
    setActiveTab,
    resetAllData,
  } = useApp();

  const [showOutletMenu, setShowOutletMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-[#fdf8f0]/90 dark:bg-[#19120e]/90 backdrop-blur-md border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 transition-colors">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 rounded-lg text-[#4a3227] dark:text-[#edd6b4] hover:bg-[#c1352d]/10 focus:outline-none lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <BrandLogo size="md" />
        </div>

        {/* Center: Outlet Switcher */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setShowOutletMenu(!showOutletMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#fffdf9] dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 hover:border-[#c1352d]/40 shadow-xs transition-all"
          >
            <Store className="w-3.5 h-3.5 text-[#c1352d]" />
            <span>{currentOutlet.name}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {showOutletMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#fffdf9] dark:bg-[#251b16] rounded-xl shadow-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7a5c4b] dark:text-[#9a8574]">
                Pilih Outlet / Cabang
              </div>
              {outlets.map(outlet => (
                <button
                  key={outlet.id}
                  onClick={() => {
                    setCurrentOutlet(outlet);
                    setShowOutletMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#c1352d]/10 ${
                    outlet.id === currentOutlet.id
                      ? 'text-[#c1352d] font-bold bg-[#c1352d]/5'
                      : 'text-[#2a1a15] dark:text-[#edd6b4]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{outlet.name}</div>
                    <div className="text-[10px] opacity-70">{outlet.code}</div>
                  </div>
                  {outlet.id === currentOutlet.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#c1352d]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Shift status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#2b8a66]/10 text-[#2b8a66] dark:bg-[#2b8a66]/20 dark:text-[#6ee7b7] border border-[#2b8a66]/20">
            <span className="w-2 h-2 rounded-full bg-[#2b8a66] animate-pulse"></span>
            <span>{currentShift ? 'Kasir Buka' : 'Kasir Tutup'}</span>
            <span className="text-[11px] opacity-80 hidden lg:inline">· {cashierName}</span>
          </div>

          {/* Mobile Cart Trigger */}
          {cartItemsCount > 0 && (
            <button
              onClick={() => setActiveTab('pos')}
              className="lg:hidden relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#c1352d] text-white text-xs font-bold shadow-md hover:bg-[#a92b24] transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{cartItemsCount}</span>
            </button>
          )}

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-lg text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#c1352d]/10 hover:text-[#c1352d] transition-colors"
            title="Reset ke Data Awal Ondeway"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative p-2 rounded-lg text-[#2a1a15] dark:text-[#fdf8f0] hover:bg-[#c1352d]/10 transition-colors"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#f0b429]" />
            ) : (
              <Moon className="w-4 h-4 text-[#4a3227]" />
            )}
          </button>

          {/* Cashier avatar */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
            <div className="w-8 h-8 rounded-full bg-[#c1352d] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              RP
            </div>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#fffdf9] dark:bg-[#201712] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-[#c1352d]/10 text-[#c1352d]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                  Reset ke Data Awal Ondeway?
                </h3>
                <p className="mt-1.5 text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 leading-relaxed">
                  Tindakan ini akan mengembalikan stok bahan baku, transaksi POS, resep HPP, akun
                  B2B/B2C, dan absensi ke kondisi awal percontohan Ondeway Coffee Company.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-[#4a3227] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5 dark:hover:bg-[#fdf8f0]/5"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#c1352d] text-white hover:bg-[#a92b24] shadow-xs"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
