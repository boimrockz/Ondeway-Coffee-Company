import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Scale,
  Percent,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Coffee,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoastingBatch } from '../../types';

export const RoasteryBatches: React.FC = () => {
  const { roastingBatches, materials, addRoastingBatch } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const greenBeans = materials.filter(m => m.category === 'green_bean');
  const [selectedGreenId, setSelectedGreenId] = useState<string>(
    greenBeans[0]?.id || ''
  );
  const [greenWeight, setGreenWeight] = useState<number>(15);
  const [roastedWeight, setRoastedWeight] = useState<number>(12.6);
  const [profile, setProfile] = useState<RoastingBatch['roastProfile']>('Medium');
  const [roasterName, setRoasterName] = useState<string>('Fajar Nugraha (Head Roaster)');
  const [notes, setNotes] = useState<string>('');

  const selectedGreen = materials.find(m => m.id === selectedGreenId);

  // Live shrinkage calculation
  const shrinkagePercent =
    greenWeight > 0 ? Number((((greenWeight - roastedWeight) / greenWeight) * 100).toFixed(1)) : 0;

  // Cost calculation
  const totalGreenCost = (selectedGreen?.costPerUnit || 100000) * greenWeight;
  const gasLaborOverhead = 25000 * greenWeight; // approx Rp 25k per kg roasting overhead
  const resultingCostPerKg =
    roastedWeight > 0 ? Math.round((totalGreenCost + gasLaborOverhead) / roastedWeight) : 0;

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGreen || greenWeight <= 0 || roastedWeight <= 0) return;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
      .getDate()
      .toString()
      .padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const batchNumber = `ROAST-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${(roastingBatches.length + 1)
      .toString()
      .padStart(2, '0')}`;

    addRoastingBatch({
      batchNumber,
      date: dateStr,
      greenBeanId: selectedGreen.id,
      greenBeanName: selectedGreen.name,
      greenWeightKg: Number(greenWeight),
      roastedWeightKg: Number(roastedWeight),
      shrinkagePercent,
      roastProfile: profile,
      roasterName,
      resultingCostPerKg,
      notes,
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-amber-500/10 via-[#c1352d]/10 to-transparent border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#c1352d]" />
            <span>Manajemen Roastery (Kebun → Sangrai → Gudang)</span>
          </h3>
          <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1 max-w-2xl leading-relaxed">
            Catat susut green bean ke roasted bean secara akurat. Input batch baru otomatis memotong
            stok Green Bean (kg) dan menambahkan stok Roasted Bean siap seduh ke inventaris kasir.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#c1352d] text-white text-xs font-bold hover:bg-[#a92b24] shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Batch Roasting Baru</span>
        </button>
      </div>

      {/* Batches Table */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fdf8f0] dark:bg-[#251b16] text-[#7a5c4b] dark:text-[#edd6b4] font-bold border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
              <tr>
                <th className="py-3 px-4">No. Batch & Tanggal</th>
                <th className="py-3 px-4">Bahan Baku (Green Bean)</th>
                <th className="py-3 px-4">Berat Mentah (Green)</th>
                <th className="py-3 px-4">Hasil Matang (Roasted)</th>
                <th className="py-3 px-4">Susut (Shrinkage)</th>
                <th className="py-3 px-4">Profil Sangrai</th>
                <th className="py-3 px-4">HPP Hasil / Kg</th>
                <th className="py-3 px-4">Roaster Barista</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a1a15]/5 dark:divide-[#fdf8f0]/5">
              {roastingBatches.map(b => (
                <tr
                  key={b.id}
                  className="hover:bg-[#2a1a15]/2 dark:hover:bg-[#fdf8f0]/2 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                      {b.batchNumber}
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{b.date}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#2a1a15] dark:text-[#fdf8f0]">
                      {b.greenBeanName}
                    </div>
                    {b.notes && (
                      <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/70 italic mt-0.5 max-w-xs">
                        "{b.notes}"
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 font-bold text-gray-600 dark:text-gray-300">
                    {b.greenWeightKg} kg
                  </td>

                  <td className="py-3 px-4 font-extrabold text-[#2a1a15] dark:text-[#fdf8f0]">
                    {b.roastedWeightKg} kg
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.shrinkagePercent <= 16.5
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {b.shrinkagePercent}%
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 text-[#4a3227] dark:text-[#edd6b4]">
                      {b.roastProfile}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-extrabold text-[#c1352d] dark:text-[#f6c4b8]">
                    Rp {b.resultingCostPerKg.toLocaleString('id-ID')} /kg
                  </td>

                  <td className="py-3 px-4 font-medium text-[#4a3227] dark:text-[#edd6b4]">
                    {b.roasterName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD NEW BATCH MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateBatch}
            className="w-full max-w-lg bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto space-y-3.5"
          >
            <div className="flex items-center justify-between pb-2 border-b">
              <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                Catat Batch Roasting Baru
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1">Pilih Green Bean (Asal Kebun)</label>
              <select
                value={selectedGreenId}
                onChange={e => setSelectedGreenId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-semibold text-xs"
              >
                {greenBeans.map(gb => (
                  <option key={gb.id} value={gb.id}>
                    {gb.name} · Sisa Stok: {gb.stock} kg · Rp {gb.costPerUnit.toLocaleString('id-ID')}/kg
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Berat Mentah Green Bean (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={greenWeight}
                  onChange={e => setGreenWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-bold text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Hasil Biji Matang Roasted (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={roastedWeight}
                  onChange={e => setRoastedWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-bold text-xs"
                />
              </div>
            </div>

            {/* Live Shrinkage & Cost Preview */}
            <div className="p-3.5 rounded-xl bg-linear-to-r from-emerald-500/10 to-[#c1352d]/10 border border-[#2a1a15]/10 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[10px] text-gray-500 font-semibold">Tingkat Susut (Shrinkage)</div>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                  {shrinkagePercent}%
                </div>
                <span className="text-[9px] text-gray-500">
                  {shrinkagePercent <= 16.5 ? '✓ Standar optimal tercapai' : '⚠️ Susut agak tinggi'}
                </span>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 font-semibold">HPP Hasil Sangrai</div>
                <div className="text-lg font-black text-[#c1352d]">
                  Rp {resultingCostPerKg.toLocaleString('id-ID')} /kg
                </div>
                <span className="text-[9px] text-gray-500">
                  ≈ Rp {Math.round(resultingCostPerKg / 1000)} /gram
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Profil Sangrai</label>
                <select
                  value={profile}
                  onChange={e => setProfile(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-semibold text-xs"
                >
                  <option value="Light">Light Roast (Filter)</option>
                  <option value="Medium">Medium Roast (All Round)</option>
                  <option value="Medium-Dark">Medium-Dark (Espresso Blend)</option>
                  <option value="Dark">Dark Roast (Bold)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Nama Roaster</label>
                <input
                  type="text"
                  required
                  value={roasterName}
                  onChange={e => setRoasterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Catatan Profil Rasa / Cupping</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Contoh: First crack menit 8:30, aroma peach dan hazelnut manis"
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
              />
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
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
                Simpan & Update Stok Otomatis
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
