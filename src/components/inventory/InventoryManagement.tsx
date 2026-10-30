import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  ArrowUpDown,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RawMaterial, MaterialCategory } from '../../types';

export const InventoryManagement: React.FC = () => {
  const { materials, adjustMaterialStock, addRawMaterial } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedMat, setSelectedMat] = useState<RawMaterial | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Penerimaan Restock Baru');

  // New Material Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<MaterialCategory>('green_bean');
  const [newOrigin, setNewOrigin] = useState('');
  const [newStock, setNewStock] = useState<number>(10);
  const [newUnit, setNewUnit] = useState<RawMaterial['unit']>('kg');
  const [newCost, setNewCost] = useState<number>(100000);
  const [newMinAlert, setNewMinAlert] = useState<number>(20);
  const [newSupplier, setNewSupplier] = useState('');

  const filtered = materials.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      (m.origin && m.origin.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalStockValue = materials.reduce(
    (sum, m) => sum + m.stock * m.costPerUnit,
    0
  );

  const lowStockCount = materials.filter(m => m.stock <= m.minStockAlert).length;

  const handleOpenAdjust = (m: RawMaterial) => {
    setSelectedMat(m);
    setAdjustDelta(0);
    setAdjustReason('Penerimaan Restock Baru');
    setShowAdjustModal(true);
  };

  const handleConfirmAdjust = () => {
    if (!selectedMat || adjustDelta === 0) return;
    adjustMaterialStock(selectedMat.id, adjustDelta, adjustReason);
    setShowAdjustModal(false);
    setSelectedMat(null);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;
    addRawMaterial({
      code: newCode,
      name: newName,
      category: newCat,
      origin: newOrigin || undefined,
      stock: Number(newStock),
      unit: newUnit,
      costPerUnit: Number(newCost),
      minStockAlert: Number(newMinAlert),
      supplier: newSupplier || undefined,
      lastRestocked: new Date().toISOString().slice(0, 10),
    });
    setShowAddModal(false);
    // reset form
    setNewName('');
    setNewCode('');
    setNewOrigin('');
  };

  const getCategoryLabel = (cat: MaterialCategory) => {
    switch (cat) {
      case 'green_bean':
        return 'Green Bean (Kebun)';
      case 'roasted_bean':
        return 'Biji Sangrai (Roastery)';
      case 'dairy':
        return 'Susu & Dairy';
      case 'flavor_syrup':
        return 'Gula & Sirup';
      case 'packaging':
        return 'Kemasan & Cup';
      case 'kitchen':
        return 'Kitchen & Pastry';
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Inventory Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
            Total Nilai Persediaan Stok
          </div>
          <div className="text-xl font-extrabold text-[#c1352d] mt-1">
            Rp {totalStockValue.toLocaleString('id-ID')}
          </div>
          <p className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/70 mt-1">
            Dari {materials.length} item bahan baku aktif
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
            Peringatan Stok Menipis
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-extrabold text-amber-600">
              {lowStockCount} Item
            </span>
            {lowStockCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                Perlu Restock
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/70 mt-1">
            Di bawah batas minimum aman operasional
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
              Integrasi Resep & POS
            </div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Auto Potong Saat Kasir Input</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 rounded-xl bg-[#c1352d] text-white text-xs font-bold hover:bg-[#a92b24] shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Bahan</span>
          </button>
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
            placeholder="Cari bahan baku, asal kebun, kode..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] focus:outline-none focus:border-[#c1352d]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] font-semibold"
          >
            <option value="all">Semua Kategori Bahan</option>
            <option value="green_bean">Green Bean (Kebun)</option>
            <option value="roasted_bean">Biji Sangrai (Roastery)</option>
            <option value="dairy">Susu & Dairy</option>
            <option value="flavor_syrup">Gula & Sirup</option>
            <option value="packaging">Kemasan & Cup</option>
            <option value="kitchen">Kitchen & Pastry</option>
          </select>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fdf8f0] dark:bg-[#251b16] text-[#7a5c4b] dark:text-[#edd6b4] font-bold border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
              <tr>
                <th className="py-3 px-4">Kode & Nama Bahan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Asal Kebun / Spesifikasi</th>
                <th className="py-3 px-4">Sisa Stok</th>
                <th className="py-3 px-4">Biaya / Satuan</th>
                <th className="py-3 px-4">Nilai Stok</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a1a15]/5 dark:divide-[#fdf8f0]/5">
              {filtered.map(m => {
                const isLow = m.stock <= m.minStockAlert;
                const valueTotal = m.stock * m.costPerUnit;

                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-[#2a1a15]/2 dark:hover:bg-[#fdf8f0]/2 transition-colors ${
                      isLow ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/70 font-mono">
                        {m.code}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 text-[#4a3227] dark:text-[#edd6b4]">
                        {getCategoryLabel(m.category)}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="text-[11px] text-[#4a3227] dark:text-[#edd6b4] truncate">
                        {m.origin || m.supplier || '—'}
                      </div>
                      {m.lastRestocked && (
                        <div className="text-[9px] text-gray-400">
                          Restock: {m.lastRestocked}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 font-extrabold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                      {m.stock.toLocaleString('id-ID')} {m.unit}
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#7a5c4b] dark:text-[#edd6b4]">
                      Rp {m.costPerUnit.toLocaleString('id-ID')} /{m.unit}
                    </td>

                    <td className="py-3 px-4 font-bold text-[#c1352d] dark:text-[#f6c4b8]">
                      Rp {valueTotal.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Menipis (Min: {m.minStockAlert})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          <span>Aman</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenAdjust(m)}
                        className="px-2.5 py-1 rounded-lg border border-[#c1352d]/30 bg-[#c1352d]/10 hover:bg-[#c1352d] hover:text-white text-[#c1352d] font-bold text-[11px] transition-colors"
                      >
                        Penyesuaian / Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUSTMENT MODAL */}
      {showAdjustModal && selectedMat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs">
            <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
              Penyesuaian Stok: {selectedMat.name}
            </h4>
            <p className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1">
              Stok Saat Ini: <b>{selectedMat.stock.toLocaleString('id-ID')} {selectedMat.unit}</b>
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="font-bold block mb-1">
                  Jumlah Perubahan (+ untuk Tambah Restock, - untuk Susut/Rusak)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={adjustDelta || ''}
                    onChange={e => setAdjustDelta(Number(e.target.value) || 0)}
                    placeholder="Contoh: 50 atau -2"
                    className="flex-1 px-3 py-2 text-sm font-bold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] focus:outline-none focus:border-[#c1352d]"
                  />
                  <span className="font-bold text-xs">{selectedMat.unit}</span>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Alasan / Catatan Penyesuaian</label>
                <select
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                >
                  <option value="Penerimaan Restock Baru">Penerimaan Restock Baru dari Pemasok</option>
                  <option value="Hasil Roasting In-House">Hasil Roasting In-House</option>
                  <option value="Stock Opname Koreksi Fisik">Stock Opname Koreksi Fisik Bulanan</option>
                  <option value="Bahan Kedaluwarsa / Rusak">Bahan Kedaluwarsa / Rusak / Spoilage</option>
                  <option value="Kalibrasi & Tasting Barista">Kalibrasi & Tasting Barista Harian</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 flex justify-between font-bold">
                <span>Stok Akhir Setelah Penyesuaian:</span>
                <span className="text-[#c1352d]">
                  {Math.max(0, selectedMat.stock + adjustDelta).toLocaleString('id-ID')} {selectedMat.unit}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={adjustDelta === 0}
                onClick={handleConfirmAdjust}
                className="px-4 py-1.5 rounded-xl bg-[#c1352d] text-white font-bold hover:bg-[#a92b24] disabled:opacity-50"
              >
                Simpan Penyesuaian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MATERIAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateMaterial}
            className="w-full max-w-lg bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto space-y-3"
          >
            <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0] pb-2 border-b">
              Tambah Bahan Baku Baru (Kebun / Roastery / Bar)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Kode Bahan</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  placeholder="RM-GB-TORJ"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Kategori</label>
                <select
                  value={newCat}
                  onChange={e => setNewCat(e.target.value as MaterialCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                >
                  <option value="green_bean">Green Bean (Kebun)</option>
                  <option value="roasted_bean">Biji Sangrai (Roastery)</option>
                  <option value="dairy">Susu & Dairy</option>
                  <option value="flavor_syrup">Gula & Sirup</option>
                  <option value="packaging">Kemasan & Cup</option>
                  <option value="kitchen">Kitchen & Pastry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Nama Bahan Baku</label>
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Contoh: Green Bean Arabica Toraja Sapan"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Asal Kebun / Asal Pemasok</label>
              <input
                type="text"
                value={newOrigin}
                onChange={e => setNewOrigin(e.target.value)}
                placeholder="Toraja Utara (1.700 masl, Fully Washed)"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold block mb-1">Stok Awal</label>
                <input
                  type="number"
                  required
                  value={newStock}
                  onChange={e => setNewStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Satuan Unit</label>
                <select
                  value={newUnit}
                  onChange={e => setNewUnit(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                >
                  <option value="kg">kg (Kilogram)</option>
                  <option value="gram">gram</option>
                  <option value="ml">ml (Mililiter)</option>
                  <option value="liter">liter</option>
                  <option value="pcs">pcs</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Biaya / Satuan (Rp)</label>
                <input
                  type="number"
                  required
                  value={newCost}
                  onChange={e => setNewCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Batas Minimum Peringatan</label>
                <input
                  type="number"
                  required
                  value={newMinAlert}
                  onChange={e => setNewMinAlert(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Nama Pemasok / Koperasi</label>
                <input
                  type="text"
                  value={newSupplier}
                  onChange={e => setNewSupplier(e.target.value)}
                  placeholder="Koperasi Petani Toraja"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                />
              </div>
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
                Tambahkan Bahan Baku
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
