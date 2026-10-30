import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Calendar,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FinanceDashboard: React.FC = () => {
  const { transactions, materials, customers } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'pnl' | 'cashflow' | 'balance'>('pnl');

  const completedTxs = transactions.filter(t => t.status === 'completed');

  // Revenue & HPP
  const totalRevenue = completedTxs.reduce((sum, t) => sum + t.total, 0);
  const totalHPP = completedTxs.reduce((sum, t) => sum + t.totalHPP, 0);
  const grossProfit = totalRevenue - totalHPP;
  const grossMarginPercent =
    totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(1)) : 0;

  // Operating Expenses (Opex) estimates
  const opexExpenses = [
    { label: 'Gaji Barista, Roaster & Staf Cafe', amount: 12500000 },
    { label: 'Sewa Tempat & Maintenance Outlet', amount: 6000000 },
    { label: 'Listrik, Air & Gas Roasting', amount: 2200000 },
    { label: 'Pemasaran & Media Sosial', amount: 1500000 },
    { label: 'Logistik & Pengiriman B2B', amount: 950000 },
  ];
  const totalOpex = opexExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossProfit - totalOpex;

  // Balance sheet metrics
  const totalStockValue = materials.reduce((sum, m) => sum + m.stock * m.costPerUnit, 0);
  const totalReceivables = customers
    .filter(c => c.type === 'b2b')
    .reduce((sum, c) => sum + (c.currentDebt || 0), 0);
  const cashAtBank = 48500000;
  const fixedAssets = 145000000; // Mesin Roaster Probat + Mesin Espresso La Marzocco + Grinder

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Invoice,Tanggal,Pelanggan,Metode,Total,HPP,Laba Kotor\n' +
      completedTxs
        .map(
          t =>
            `"${t.invoiceNo}","${t.date}","${t.customerName}","${t.paymentMethod}",${t.total},${t.totalHPP},${t.grossProfit}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan-keuangan-ondeway-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#c1352d]" />
            <span>Dashboard Eksekutif Keuangan & Akuntansi</span>
          </h3>
          <p className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-0.5">
            Laporan laba rugi terintegrasi live dari POS, beban HPP resep otomatis, dan arus kas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 p-0.5 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveSubTab('pnl')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'pnl'
                  ? 'bg-white dark:bg-[#251b16] text-[#c1352d] shadow-xs'
                  : 'text-[#7a5c4b] dark:text-[#edd6b4]'
              }`}
            >
              Laba Rugi (P&L)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('cashflow')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'cashflow'
                  ? 'bg-white dark:bg-[#251b16] text-[#c1352d] shadow-xs'
                  : 'text-[#7a5c4b] dark:text-[#edd6b4]'
              }`}
            >
              Arus Kas
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('balance')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'balance'
                  ? 'bg-white dark:bg-[#251b16] text-[#c1352d] shadow-xs'
                  : 'text-[#7a5c4b] dark:text-[#edd6b4]'
              }`}
            >
              Neraca
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] hover:bg-[#c1352d]/10 hover:text-[#c1352d] text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: P&L (LABA RUGI) */}
      {activeSubTab === 'pnl' && (
        <div className="space-y-4">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
              <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
                Pendapatan Penjualan Bersih
              </div>
              <div className="text-xl font-black text-[#c1352d] mt-1">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                ↑ 14.8% vs bulan lalu
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
              <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
                Beban Pokok Penjualan (HPP)
              </div>
              <div className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">
                Rp {totalHPP.toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/70 mt-1">
                {100 - grossMarginPercent}% dari omset
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
              <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
                Laba Kotor (Gross Margin)
              </div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                Rp {grossProfit.toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                Margin {grossMarginPercent}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
              <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
                Laba Bersih Operasional
              </div>
              <div
                className={`text-xl font-black mt-1 ${
                  netProfit >= 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                Rp {netProfit.toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/70 mt-1">
                Setelah beban tetap & gaji
              </div>
            </div>
          </div>

          {/* Detailed Statement Table */}
          <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 p-5 shadow-xs text-xs space-y-3">
            <h4 className="font-extrabold text-sm text-[#2a1a15] dark:text-[#fdf8f0] pb-2 border-b">
              Laporan Laba Rugi Komprehensif (Income Statement)
            </h4>

            {/* Revenues */}
            <div className="space-y-1.5">
              <div className="font-bold text-[#c1352d] uppercase text-[10px] tracking-wider">
                1. PENDAPATAN USAHA (REVENUES)
              </div>
              <div className="flex justify-between pl-3 text-[#4a3227] dark:text-[#edd6b4]">
                <span>Penjualan Minuman & Makanan POS (B2C)</span>
                <span className="font-semibold">
                  Rp{' '}
                  {completedTxs
                    .filter(t => t.customerType === 'b2c')
                    .reduce((s, t) => s + t.total, 0)
                    .toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between pl-3 text-[#4a3227] dark:text-[#edd6b4]">
                <span>Penjualan Whole Bean Roastery & B2B Partner</span>
                <span className="font-semibold">
                  Rp{' '}
                  {completedTxs
                    .filter(t => t.customerType === 'b2b')
                    .reduce((s, t) => s + t.total, 0)
                    .toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between font-extrabold pt-1 border-t text-[#2a1a15] dark:text-[#fdf8f0]">
                <span>TOTAL PENDAPATAN BERSIH</span>
                <span>Rp {totalRevenue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* COGS */}
            <div className="space-y-1.5 pt-2">
              <div className="font-bold text-amber-700 uppercase text-[10px] tracking-wider">
                2. HARGA POKOK PENJUALAN (COGS / BEBAN BAHAN BAKU)
              </div>
              <div className="flex justify-between pl-3 text-[#4a3227] dark:text-[#edd6b4]">
                <span>Bahan Biji Kopi Sangrai & Green Bean</span>
                <span className="font-semibold">
                  Rp {Math.round(totalHPP * 0.55).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between pl-3 text-[#4a3227] dark:text-[#edd6b4]">
                <span>Susu Segar (Fresh Milk & Oat Milk)</span>
                <span className="font-semibold">
                  Rp {Math.round(totalHPP * 0.3).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between pl-3 text-[#4a3227] dark:text-[#edd6b4]">
                <span>Sirup, Aren, Cup PET & Kemasan Foil</span>
                <span className="font-semibold">
                  Rp {Math.round(totalHPP * 0.15).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between font-extrabold pt-1 border-t text-amber-800 dark:text-amber-300">
                <span>TOTAL HPP (COGS)</span>
                <span>- Rp {totalHPP.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Gross Profit Bar */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between font-black text-sm text-emerald-900 dark:text-emerald-200">
              <span>LABA KOTOR (GROSS PROFIT)</span>
              <span>Rp {grossProfit.toLocaleString('id-ID')}</span>
            </div>

            {/* OPEX */}
            <div className="space-y-1.5 pt-2">
              <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">
                3. BEBAN OPERASIONAL (OPERATING EXPENSES)
              </div>
              {opexExpenses.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex justify-between pl-3 text-[#4a3227] dark:text-[#edd6b4]"
                >
                  <span>{exp.label}</span>
                  <span className="font-semibold">
                    Rp {exp.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-extrabold pt-1 border-t text-gray-800 dark:text-gray-200">
                <span>TOTAL BEBAN OPERASIONAL</span>
                <span>- Rp {totalOpex.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Final Net Profit */}
            <div className="p-3.5 rounded-xl bg-[#c1352d]/10 border border-[#c1352d]/20 flex justify-between font-black text-base text-[#c1352d] dark:text-[#f6c4b8]">
              <span>LABA BERSIH BERJALAN (NET INCOME)</span>
              <span>Rp {netProfit.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ARUS KAS */}
      {activeSubTab === 'cashflow' && (
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 p-5 shadow-xs text-xs space-y-4">
          <h4 className="font-extrabold text-sm text-[#2a1a15] dark:text-[#fdf8f0] pb-2 border-b">
            Laporan Arus Kas Operasional (Cash Flow)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cash In */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                <span>Penerimaan Kas (Cash Inflows)</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Kas Penjualan Tunai di Kasir</span>
                  <span className="font-semibold">
                    Rp{' '}
                    {completedTxs
                      .filter(t => t.paymentMethod === 'cash')
                      .reduce((s, t) => s + t.total, 0)
                      .toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Penerimaan QRIS Masuk Rekening</span>
                  <span className="font-semibold">
                    Rp{' '}
                    {completedTxs
                      .filter(t => t.paymentMethod === 'qris')
                      .reduce((s, t) => s + t.total, 0)
                      .toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Penerimaan Kartu Debit & EDC</span>
                  <span className="font-semibold">
                    Rp{' '}
                    {completedTxs
                      .filter(t => t.paymentMethod === 'debit')
                      .reduce((s, t) => s + t.total, 0)
                      .toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Cash Out */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 space-y-2">
              <div className="font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-red-600" />
                <span>Pengeluaran Kas (Cash Outflows)</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Pembelian Green Bean ke Petani Gayo & Flores</span>
                  <span className="font-semibold">Rp 18.500.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Pembelian Fresh Milk Pasteurisasi</span>
                  <span className="font-semibold">Rp 4.200.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Operasional & Gaji Karyawan</span>
                  <span className="font-semibold">Rp 14.700.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: NERACA */}
      {activeSubTab === 'balance' && (
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 p-5 shadow-xs text-xs space-y-3">
          <h4 className="font-extrabold text-sm text-[#2a1a15] dark:text-[#fdf8f0] pb-2 border-b">
            Neraca Ringkas (Balance Sheet)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aset */}
            <div className="space-y-2">
              <div className="font-bold text-[#c1352d] uppercase text-[10px]">ASET (ASSETS)</div>
              <div className="p-3 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Kas & Bank Operasional</span>
                  <span className="font-bold">Rp {cashAtBank.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Persediaan Bahan Baku (Stok Fisik)</span>
                  <span className="font-bold text-emerald-700">
                    Rp {totalStockValue.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Piutang Usaha (B2B Receivables)</span>
                  <span className="font-bold text-amber-700">
                    Rp {totalReceivables.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Aset Tetap (Mesin Roaster & Espresso)</span>
                  <span className="font-bold">Rp {fixedAssets.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-black pt-2 border-t text-[#c1352d]">
                  <span>TOTAL ASET</span>
                  <span>
                    Rp{' '}
                    {(
                      cashAtBank +
                      totalStockValue +
                      totalReceivables +
                      fixedAssets
                    ).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Liabilitas & Ekuitas */}
            <div className="space-y-2">
              <div className="font-bold text-[#7a5c4b] uppercase text-[10px]">
                KEWAJIBAN & EKUITAS
              </div>
              <div className="p-3 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Hutang Dagang Pemasok Susu & Kemasan</span>
                  <span className="font-bold">Rp 6.800.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Modal Disetor Pendiri (Equity)</span>
                  <span className="font-bold">Rp 180.000.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Saldo Laba Ditahan (Retained Earnings)</span>
                  <span className="font-bold text-emerald-700">
                    Rp{' '}
                    {(
                      cashAtBank +
                      totalStockValue +
                      totalReceivables +
                      fixedAssets -
                      186800000
                    ).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between font-black pt-2 border-t text-[#2a1a15] dark:text-[#fdf8f0]">
                  <span>TOTAL KEWAJIBAN & EKUITAS</span>
                  <span>
                    Rp{' '}
                    {(
                      cashAtBank +
                      totalStockValue +
                      totalReceivables +
                      fixedAssets
                    ).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
