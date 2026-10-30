import React from 'react';
import {
  CreditCard,
  Receipt,
  Package,
  Calculator,
  Flame,
  TrendingUp,
  Clock,
  Users,
  TicketPercent,
  Target,
  Network,
  Palette,
  ChevronRight,
  Coffee,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavGroup {
  groupLabel: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: 'POS & KASIR',
    items: [
      { id: 'pos', label: 'Kasir (POS Pintar)', icon: CreditCard, badge: 'Live' },
      { id: 'menu', label: 'Master Data Menu', icon: Coffee },
      { id: 'transactions', label: 'Riwayat Transaksi', icon: Receipt },
    ],
  },
  {
    groupLabel: 'ROASTERY & BAHAN BAKU',
    items: [
      { id: 'inventory', label: 'Stok (Kebun → Cup)', icon: Package },
      { id: 'recipes', label: 'Resep & HPP Otomatis', icon: Calculator },
      { id: 'roastery', label: 'Batch Sangrai (Roast)', icon: Flame },
    ],
  },
  {
    groupLabel: 'KEUANGAN & KARYAWAN',
    items: [
      { id: 'finance', label: 'Keuangan & Laba Rugi', icon: TrendingUp },
      { id: 'attendance', label: 'Absensi & Tutup Kasir', icon: Clock },
      { id: 'employees', label: 'Data Karyawan & SDM', icon: Users },
      { id: 'lms', label: 'Akademi & SOP (LMS)', icon: GraduationCap, badge: 'LMS' },
    ],
  },
  {
    groupLabel: 'PELANGGAN & PROMO',
    items: [
      { id: 'customers', label: 'B2C Poin & B2B Tier', icon: Users },
      { id: 'promos', label: 'Promo & Voucher', icon: TicketPercent },
    ],
  },
  {
    groupLabel: 'STRATEGI & ORGANISASI',
    items: [
      { id: 'strategy', label: 'BSC · KPI · OKR', icon: Target },
      { id: 'org_structure', label: 'Struktur Organisasi & RACI', icon: Network },
      { id: 'design', label: 'Design System & Cetak', icon: Palette },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, cart } = useApp();
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-[#fdf8f0] dark:bg-[#160f0c] border-r border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#9a8574] dark:text-[#7c6657]">
                {group.groupLabel}
              </div>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isPosWithItems = item.id === 'pos' && cartCount > 0;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-[#c1352d] text-white shadow-xs'
                          : 'text-[#4a3227] dark:text-[#edd6b4] hover:bg-[#c1352d]/8 dark:hover:bg-[#fdf8f0]/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-[#7a5c4b] dark:text-[#9a8574] group-hover:text-[#c1352d]'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isPosWithItems && (
                          <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-white text-[#c1352d] dark:bg-[#fffdf9] dark:text-[#c1352d]">
                            {cartCount}
                          </span>
                        )}
                        {item.badge && !isPosWithItems && (
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#c1352d]/10 text-[#c1352d] dark:bg-[#c1352d]/20 dark:text-[#f6c4b8]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && !isPosWithItems && !item.badge && (
                          <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fffdf9]/50 dark:bg-[#1f1511]/50">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#c1352d]/5 dark:bg-[#c1352d]/10 border border-[#c1352d]/15">
            <div className="p-1.5 rounded-md bg-[#c1352d] text-white">
              <Coffee className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] leading-tight">
              <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                Ondeway Roastery
              </div>
              <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/80">
                Pantan Musara · Bajawa
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
