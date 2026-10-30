import React, { useState } from 'react';
import {
  Clock,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Plus,
  Coins,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CashierShift } from '../../types';

export const AttendanceShift: React.FC = () => {
  const {
    currentShift,
    shifts,
    attendance,
    cashierName,
    currentOutlet,
    closeCashDrawer,
    openNewShift,
    clockInAttendance,
    clockOutAttendance,
  } = useApp();

  const [showCloseModal, setShowCloseModal] = useState(false);
  const [actualCashInput, setActualCashInput] = useState<number>(0);
  const [closeNotes, setCloseNotes] = useState('');

  // Open shift modal
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [newFloat, setNewFloat] = useState<number>(500000);
  const [selectedShiftName, setSelectedShiftName] = useState<CashierShift['shiftName']>(
    'Shift Pagi (07:00 - 15:00)'
  );

  const handleOpenCloseModal = () => {
    if (!currentShift) return;
    setActualCashInput(currentShift.expectedCashTotal);
    setShowCloseModal(true);
  };

  const handleConfirmClose = () => {
    closeCashDrawer(actualCashInput, closeNotes);
    setShowCloseModal(false);
    setCloseNotes('');
  };

  const handleConfirmOpen = () => {
    openNewShift(selectedShiftName, newFloat);
    setShowOpenModal(false);
  };

  const variance = currentShift ? actualCashInput - currentShift.expectedCashTotal : 0;

  return (
    <div className="space-y-4">
      {/* SHIFT & CASH DRAWER PANEL */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentShift ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
              <h3 className="text-sm font-extrabold text-[#2a1a15] dark:text-[#fdf8f0]">
                {currentShift
                  ? `Sesi Kasir Aktif: ${currentShift.shiftName}`
                  : 'Sesi Kasir Sedang Tutup'}
              </h3>
            </div>
            <p className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-0.5">
              Kasir Bertugas: <b>{cashierName}</b> · {currentOutlet.name}
            </p>
          </div>

          <div>
            {currentShift ? (
              <button
                type="button"
                onClick={handleOpenCloseModal}
                className="px-4 py-2 rounded-xl bg-[#c1352d] text-white font-bold text-xs hover:bg-[#a92b24] shadow-xs flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Tutup Kasir & Rekonsiliasi Kas</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowOpenModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Buka Kasir Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Drawer Figures */}
        {currentShift && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="p-3 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3">
              <span className="text-[10px] text-gray-500 font-semibold block">Modal Awal Kas</span>
              <span className="text-base font-extrabold text-[#2a1a15] dark:text-[#fdf8f0]">
                Rp {currentShift.initialFloat.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold block">
                Penjualan Tunai Shift
              </span>
              <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                Rp {currentShift.totalCashSales.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
              <span className="text-[10px] text-indigo-800 dark:text-indigo-300 font-semibold block">
                Penjualan QRIS Shift
              </span>
              <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-400">
                Rp {currentShift.totalQrisSales.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#c1352d]/10 border border-[#c1352d]/20">
              <span className="text-[10px] text-[#c1352d] font-bold block">
                Total Uang Fisik Seharusnya
              </span>
              <span className="text-base font-black text-[#c1352d]">
                Rp {currentShift.expectedCashTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ATTENDANCE SECTION */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
          <div>
            <h4 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#c1352d]" />
              <span>Daftar Absensi & Jam Kerja Karyawan Hari Ini</span>
            </h4>
            <p className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/80">
              Pencatatan jam masuk (Clock In) dan jam pulang (Clock Out) tim barista & roastery
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              clockInAttendance(cashierName, 'Lead Cashier', 'Shift Pagi (07:00 - 15:00)')
            }
            className="px-3 py-1.5 rounded-xl border border-[#c1352d]/30 bg-[#c1352d]/10 hover:bg-[#c1352d] hover:text-white text-[#c1352d] font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Clock In ({cashierName})</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fdf8f0] dark:bg-[#251b16] text-[#7a5c4b] dark:text-[#edd6b4] font-bold border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
              <tr>
                <th className="py-2.5 px-3">Nama Karyawan</th>
                <th className="py-2.5 px-3">Peran / Posisi</th>
                <th className="py-2.5 px-3">Shift</th>
                <th className="py-2.5 px-3">Jam Masuk</th>
                <th className="py-2.5 px-3">Jam Pulang</th>
                <th className="py-2.5 px-3">Status Kehadiran</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a1a15]/5 dark:divide-[#fdf8f0]/5">
              {attendance.map(a => (
                <tr
                  key={a.id}
                  className="hover:bg-[#2a1a15]/2 dark:hover:bg-[#fdf8f0]/2 transition-colors"
                >
                  <td className="py-2.5 px-3 font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                    {a.employeeName}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500">{a.role}</td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">{a.shift}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                    {a.clockIn}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {a.clockOut || (
                      <span className="text-amber-600 italic">Sedang Bertugas</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        a.status === 'Hadir Tepat Waktu'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {!a.clockOut && (
                      <button
                        type="button"
                        onClick={() => clockOutAttendance(a.id)}
                        className="px-2 py-1 rounded bg-[#2a1a15]/5 hover:bg-[#c1352d]/10 text-xs font-semibold hover:text-[#c1352d]"
                      >
                        Clock Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLOSE CASHIER MODAL */}
      {showCloseModal && currentShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs space-y-3">
            <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
              Rekonsiliasi Kas & Tutup Kasir
            </h4>
            <p className="text-[11px] text-gray-500">
              Hitung uang fisik di laci kasir dan bandingkan dengan catatan sistem
            </p>

            <div className="p-3.5 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 space-y-1.5">
              <div className="flex justify-between">
                <span>Modal Awal Kas:</span>
                <span className="font-bold">
                  Rp {currentShift.initialFloat.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Penjualan Tunai di Sistem:</span>
                <span className="font-bold text-emerald-700">
                  Rp {currentShift.totalCashSales.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t font-black">
                <span>Total Kas Fisik Seharusnya:</span>
                <span className="text-[#c1352d]">
                  Rp {currentShift.expectedCashTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">
                Hitungan Uang Fisik Sebenarnya di Laci (Rp)
              </label>
              <input
                type="number"
                value={actualCashInput || ''}
                onChange={e => setActualCashInput(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full text-base font-black px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] focus:outline-none focus:border-[#c1352d]"
              />
            </div>

            {/* Variance indicator */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between font-bold ${
                variance === 0
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800'
                  : variance > 0
                  ? 'border-blue-500/30 bg-blue-500/10 text-blue-800'
                  : 'border-red-500/30 bg-red-500/10 text-red-800'
              }`}
            >
              <span>Selisih Kas (Variance):</span>
              <span className="text-sm font-black">
                {variance === 0
                  ? 'Rp 0 (Pas / Tepat)'
                  : variance > 0
                  ? `+ Rp ${variance.toLocaleString('id-ID')} (Lebih)`
                  : `- Rp ${Math.abs(variance).toLocaleString('id-ID')} (Kurang)`}
              </span>
            </div>

            <div>
              <label className="font-bold block mb-1">Catatan Penutupan</label>
              <input
                type="text"
                value={closeNotes}
                onChange={e => setCloseNotes(e.target.value)}
                placeholder="Contoh: Pecahan rapi, uang setoran siap disetor ke bank"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-4 py-1.5 rounded-xl bg-[#c1352d] text-white font-bold hover:bg-[#a92b24]"
              >
                Konfirmasi Tutup Kasir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPEN CASHIER MODAL */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs space-y-3">
            <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
              Buka Sesi Kasir Baru
            </h4>

            <div>
              <label className="font-bold block mb-1">Pilih Shift</label>
              <select
                value={selectedShiftName}
                onChange={e => setSelectedShiftName(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
              >
                <option value="Shift Pagi (07:00 - 15:00)">Shift Pagi (07:00 - 15:00)</option>
                <option value="Shift Sore (14:30 - 22:30)">Shift Sore (14:30 - 22:30)</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Modal Awal Kas Kecil (Rp)</label>
              <input
                type="number"
                value={newFloat || ''}
                onChange={e => setNewFloat(Number(e.target.value) || 0)}
                placeholder="500000"
                className="w-full text-base font-black px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] focus:outline-none focus:border-[#c1352d]"
              />
              <span className="text-[10px] text-gray-500">
                Pecahan uang kecil untuk kembalian pembeli
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowOpenModal(false)}
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmOpen}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Buka Kasir Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
