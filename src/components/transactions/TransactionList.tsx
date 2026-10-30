import React, { useState } from 'react';
import {
  Search,
  Filter,
  Receipt,
  Printer,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { ReceiptModal } from '../pos/ReceiptModal';

export const TransactionList: React.FC = () => {
  const { transactions, voidTransaction } = useApp();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [reprintTx, setReprintTx] = useState<Transaction | null>(null);
  const [voidTargetTx, setVoidTargetTx] = useState<Transaction | null>(null);
  const [voidReason, setVoidReason] = useState('');

  const filtered = transactions.filter(t => {
    const matchesSearch =
      t.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.cashierName.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === 'all' || t.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const totalSales = filtered
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0);

  const totalProfit = filtered
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.grossProfit, 0);

  const handleConfirmVoid = () => {
    if (!voidTargetTx || !voidReason.trim()) return;
    voidTransaction(voidTargetTx.id, voidReason);
    setVoidTargetTx(null);
    setVoidReason('');
  };

  return (
    <div className="space-y-4">
      {/* Top Title & Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
            Total Transaksi Aktif
          </div>
          <div className="text-xl font-extrabold text-[#2a1a15] dark:text-[#fdf8f0] mt-1">
            {filtered.filter(t => t.status === 'completed').length} Transaksi
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
            Total Nilai Penjualan
          </div>
          <div className="text-xl font-extrabold text-[#c1352d] mt-1">
            Rp {totalSales.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
            Laba Kotor (Gross Profit)
          </div>
          <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            Rp {totalProfit.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-[#fffdf9] dark:bg-[#1e1612] p-3 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5c4b] dark:text-[#edd6b4]/70" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari no invoice, pelanggan, kasir..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] focus:outline-none focus:border-[#c1352d]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] font-semibold"
          >
            <option value="all">Semua Metode Pembayaran</option>
            <option value="cash">Tunai (Cash)</option>
            <option value="qris">QRIS Dinamis</option>
            <option value="debit">Debit / EDC</option>
            <option value="tempo">Tempo B2B</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] font-semibold"
          >
            <option value="all">Semua Status</option>
            <option value="completed">Selesai (Completed)</option>
            <option value="voided">Dibatalkan (Voided)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fdf8f0] dark:bg-[#251b16] text-[#7a5c4b] dark:text-[#edd6b4] font-bold border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
              <tr>
                <th className="py-3 px-4">No. Invoice & Waktu</th>
                <th className="py-3 px-4">Pelanggan & Tipe</th>
                <th className="py-3 px-4">Items Ringkas</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Laba Kotor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a1a15]/5 dark:divide-[#fdf8f0]/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 text-xs">
                    Tidak ada transaksi yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map(tx => (
                  <tr
                    key={tx.id}
                    className="hover:bg-[#2a1a15]/2 dark:hover:bg-[#fdf8f0]/2 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                        {tx.invoiceNo}
                      </div>
                      <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/80 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{tx.date}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#2a1a15] dark:text-[#fdf8f0]">
                        {tx.customerName}
                      </div>
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold mt-0.5 ${
                          tx.customerType === 'b2b'
                            ? 'bg-[#c1352d]/10 text-[#c1352d]'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {tx.customerType === 'b2b'
                          ? `B2B · ${tx.customerTier.toUpperCase()}`
                          : 'Ritel B2C'}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="truncate font-medium text-[#4a3227] dark:text-[#edd6b4]">
                        {tx.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {tx.orderType === 'dine_in'
                          ? `Dine In · Meja ${tx.tableNumber || '-'}`
                          : tx.orderType === 'take_away'
                          ? 'Take Away'
                          : 'Delivery'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 text-[#4a3227] dark:text-[#edd6b4]">
                        {tx.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-extrabold text-[#c1352d] dark:text-[#f6c4b8]">
                      Rp {tx.total.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400">
                      {tx.status === 'completed'
                        ? `Rp ${tx.grossProfit.toLocaleString('id-ID')}`
                        : '—'}
                    </td>

                    <td className="py-3 px-4">
                      {tx.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Selesai</span>
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full"
                          title={tx.voidReason}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Dibatalkan</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedTx(tx)}
                          className="p-1.5 rounded-lg text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5"
                          title="Lihat Rincian"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReprintTx(tx)}
                          className="p-1.5 rounded-lg text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5"
                          title="Cetak Struk"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {tx.status === 'completed' && (
                          <button
                            type="button"
                            onClick={() => setVoidTargetTx(tx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-500/10 transition-colors"
                            title="Batalkan (Void Transaksi)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
              <div>
                <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                  Rincian Transaksi {selectedTx.invoiceNo}
                </h4>
                <p className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/80">
                  {selectedTx.date} · Kasir: {selectedTx.cashierName} · {selectedTx.outletName}
                </p>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2.5 max-h-64 overflow-y-auto">
              {selectedTx.items.map((i, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 flex items-start justify-between"
                >
                  <div>
                    <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                      {i.name} x{i.qty}
                    </div>
                    {i.variant && (
                      <div className="text-[10px] text-gray-500">
                        {[i.variant.ice, i.variant.sugar, i.variant.milk, i.variant.extraShot ? 'Extra Shot' : null]
                          .filter(Boolean)
                          .join(' · ')}
                      </div>
                    )}
                    {i.note && <div className="text-[10px] italic text-gray-500">Note: "{i.note}"</div>}
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Rp {i.totalPrice.toLocaleString('id-ID')}</div>
                    <div className="text-[9px] text-gray-400">
                      HPP: Rp {i.costHPP.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {selectedTx.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {selectedTx.promoDiscount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Diskon Promo</span>
                  <span>- Rp {selectedTx.promoDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {selectedTx.pointsDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Tukar Poin</span>
                  <span>- Rp {selectedTx.pointsDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-[#2a1a15]/10">
                <span>TOTAL</span>
                <span className="text-[#c1352d]">Rp {selectedTx.total.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-700 font-semibold pt-1">
                <span>Total Estimasi HPP Bahan Baku:</span>
                <span>Rp {selectedTx.totalHPP.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-700 font-bold">
                <span>Laba Kotor (Gross Margin):</span>
                <span>Rp {selectedTx.grossProfit.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setReprintTx(selectedTx);
                  setSelectedTx(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#c1352d] text-white font-bold hover:bg-[#a92b24] flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Ulang Struk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOID CONFIRMATION MODAL */}
      {voidTargetTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs">
            <h4 className="font-bold text-sm text-red-600">
              Batalkan (Void) Transaksi {voidTargetTx.invoiceNo}?
            </h4>
            <p className="mt-1.5 text-gray-600 dark:text-gray-300 leading-relaxed">
              Transaksi ini akan dibatalkan. Stok bahan baku yang terpakai akan otomatis
              dikembalikan ke inventaris, dan poin pelanggan akan disesuaikan.
            </p>

            <div className="mt-3">
              <label className="font-bold block mb-1">Alasan Pembatalan (Wajib)</label>
              <input
                type="text"
                value={voidReason}
                onChange={e => setVoidReason(e.target.value)}
                placeholder="Contoh: Salah input pesanan / pelanggan membatalkan"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setVoidTargetTx(null)}
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!voidReason.trim()}
                onClick={handleConfirmVoid}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50"
              >
                Konfirmasi Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPRINT RECEIPT MODAL */}
      {reprintTx && (
        <ReceiptModal
          transaction={reprintTx}
          isOpen={!!reprintTx}
          onClose={() => setReprintTx(null)}
        />
      )}
    </div>
  );
};
