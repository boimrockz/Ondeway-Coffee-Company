import React, { useState } from 'react';
import {
  TicketPercent,
  Plus,
  Percent,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PromoVoucher } from '../../types';

export const PromoList: React.FC = () => {
  const { promos, addPromo } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'percent' | 'nominal'>('percent');
  const [value, setValue] = useState<number>(15);
  const [minOrder, setMinOrder] = useState<number>(35000);
  const [maxDiscount, setMaxDiscount] = useState<number>(20000);
  const [quota, setQuota] = useState<number>(100);
  const [applicableType, setApplicableType] = useState<'all' | 'b2c' | 'b2b'>('all');

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    addPromo({
      code: code.trim().toUpperCase(),
      name,
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      maxDiscount: type === 'percent' ? Number(maxDiscount) : undefined,
      usedCount: 0,
      quota: Number(quota),
      active: true,
      applicableType,
      expiryDate: '2026-12-31',
    });

    setShowAddModal(false);
    setCode('');
    setName('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-[#c1352d]/10 via-[#c1352d]/5 to-transparent border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-2">
            <TicketPercent className="w-4 h-4 text-[#c1352d]" />
            <span>Manajemen Promo & Voucher Kasir</span>
          </h3>
          <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1 max-w-2xl leading-relaxed">
            Buat kode kupon diskon persentase atau nominal rupiah. Kupon langsung divalidasi dan
            diterapkan otomatis saat kasir mengetik kode voucher di layar POS.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#c1352d] text-white text-xs font-bold hover:bg-[#a92b24] shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kupon Baru</span>
        </button>
      </div>

      {/* Promos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {promos.map(p => {
          const quotaPercent = Math.min(100, Math.round((p.usedCount / p.quota) * 100));

          return (
            <div
              key={p.code}
              className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-[#c1352d]/10 border border-[#c1352d]/20 text-[#c1352d] font-mono font-extrabold text-sm tracking-wider">
                    {p.code}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.active
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] mt-2.5">
                  {p.name}
                </h4>
                <div className="text-[11px] text-[#c1352d] font-extrabold mt-0.5">
                  {p.type === 'percent'
                    ? `Diskon ${p.value}% ${p.maxDiscount ? `(Maks Rp ${p.maxDiscount.toLocaleString('id-ID')})` : ''}`
                    : `Potongan Langsung Rp ${p.value.toLocaleString('id-ID')}`}
                </div>
              </div>

              {/* Conditions & Progress */}
              <div className="space-y-2 text-xs pt-2 border-t border-[#2a1a15]/5">
                <div className="flex justify-between text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80">
                  <span>Min. Belanja:</span>
                  <span className="font-semibold">
                    Rp {p.minOrder.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80">
                  <span>Berlaku Untuk:</span>
                  <span className="font-semibold uppercase">
                    {p.applicableType || 'Semua'}
                  </span>
                </div>

                {/* Quota Progress */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                    <span>Kuota Terpakai:</span>
                    <span>
                      {p.usedCount} / {p.quota} ({quotaPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c1352d] rounded-full transition-all"
                      style={{ width: `${quotaPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE PROMO MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreatePromo}
            className="w-full max-w-md bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b">
              <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                Buat Kupon Promo Baru
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Kode Voucher</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="KOPISORE"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Tipe Diskon</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-semibold text-xs"
                >
                  <option value="percent">Persentase (%)</option>
                  <option value="nominal">Nominal Tunai (Rp)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Nama / Judul Promo</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Diskon Happy Hour Sore 20%"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">
                  {type === 'percent' ? 'Nilai Diskon (%)' : 'Potongan Harga (Rp)'}
                </label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={e => setValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Minimal Belanja (Rp)</label>
                <input
                  type="number"
                  required
                  value={minOrder}
                  onChange={e => setMinOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                />
              </div>
            </div>

            {type === 'percent' && (
              <div>
                <label className="font-bold block mb-1">Batas Maksimal Diskon (Rp)</label>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={e => setMaxDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Total Kuota Penggunaan</label>
                <input
                  type="number"
                  required
                  value={quota}
                  onChange={e => setQuota(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Berlaku Untuk</label>
                <select
                  value={applicableType}
                  onChange={e => setApplicableType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                >
                  <option value="all">Semua Pelanggan</option>
                  <option value="b2c">Hanya Member B2C</option>
                  <option value="b2b">Hanya Mitra B2B</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#c1352d] text-white font-bold hover:bg-[#a92b24]"
              >
                Simpan Promo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
