import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  AlertCircle,
  Coffee,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Recipe, RecipeIngredient, Product } from '../../types';

export const RecipeHppCalculator: React.FC = () => {
  const { products, recipes, materials, updateRecipe, calculateProductHPP } = useApp();
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [tempIngredients, setTempIngredients] = useState<RecipeIngredient[]>([]);

  const handleOpenEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setTempIngredients([...recipe.ingredients]);
  };

  const handleAddIngredient = () => {
    const firstMat = materials[0];
    if (!firstMat) return;
    setTempIngredients(prev => [
      ...prev,
      {
        materialId: firstMat.id,
        amount: 1,
        unit: firstMat.unit,
      },
    ]);
  };

  const handleUpdateIngredient = (
    index: number,
    field: keyof RecipeIngredient,
    value: any
  ) => {
    setTempIngredients(prev => {
      const next = [...prev];
      const cur = { ...next[index], [field]: value };
      if (field === 'materialId') {
        const mat = materials.find(m => m.id === value);
        if (mat) cur.unit = mat.unit;
      }
      next[index] = cur;
      return next;
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setTempIngredients(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveRecipe = () => {
    if (!editingRecipe) return;
    updateRecipe(editingRecipe.id, tempIngredients);
    setEditingRecipe(null);
  };

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-[#c1352d]/10 via-[#c1352d]/5 to-transparent border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#c1352d]" />
            <span>Kalkulator HPP & Manajemen Resep Otomatis</span>
          </h3>
          <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1 max-w-2xl leading-relaxed">
            HPP (Harga Pokok Penjualan) dihitung langsung dari komposisi bahan baku (gram biji kopi,
            ml fresh milk, cup & packaging). Setiap penjualan di kasir akan otomatis memotong stok
            sesuai takaran resep di bawah ini.
          </p>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(prod => {
          const recipe = recipes.find(r => r.productId === prod.id);
          const computedHPP = calculateProductHPP(prod.id);
          const retailMargin = Math.round(
            ((prod.priceRetail - computedHPP) / prod.priceRetail) * 100
          );
          const grosirMargin = Math.round(
            ((prod.priceGrosir - computedHPP) / prod.priceGrosir) * 100
          );

          return (
            <div
              key={prod.id}
              className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 p-4 shadow-xs flex flex-col justify-between space-y-3"
            >
              {/* Product Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 object-cover rounded-xl border border-[#2a1a15]/10"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                      {prod.name}
                    </h4>
                    <span className="text-[10px] text-gray-500 font-mono">{prod.code}</span>
                    <div className="text-[10px] text-[#c1352d] font-bold">
                      Jual: Rp {prod.priceRetail.toLocaleString('id-ID')} (Ritel) · Rp{' '}
                      {prod.priceGrosir.toLocaleString('id-ID')} (B2B)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-semibold">HPP Live</div>
                  <div className="text-base font-extrabold text-[#c1352d]">
                    Rp {computedHPP.toLocaleString('id-ID')}
                  </div>
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      retailMargin >= 65
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    Margin {retailMargin}%
                  </span>
                </div>
              </div>

              {/* Recipe Ingredients List */}
              <div className="bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 p-3 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#7a5c4b] dark:text-[#edd6b4]/70 uppercase tracking-wider mb-1">
                  <span>Komposisi Bahan Baku</span>
                  <span>Biaya / Takaran</span>
                </div>

                {recipe && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, iIdx) => {
                    const mat = materials.find(m => m.id === ing.materialId);
                    const subCost = mat ? ing.amount * mat.costPerUnit : 0;
                    return (
                      <div key={iIdx} className="flex justify-between items-center text-[11px]">
                        <span className="text-[#2a1a15] dark:text-[#fdf8f0]">
                          • {mat ? mat.name : 'Bahan tidak ditemukan'}:{' '}
                          <b>
                            {ing.amount} {ing.unit}
                          </b>
                        </span>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">
                          Rp {Math.round(subCost).toLocaleString('id-ID')}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[11px] text-gray-400 italic">
                    Belum ada resep spesifik, HPP menggunakan estimasi dasar base cost.
                  </div>
                )}
              </div>

              {/* Card Footer Action */}
              <div className="flex items-center justify-between pt-2 border-t border-[#2a1a15]/5 text-xs">
                <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/80">
                  Margin Grosir B2B: <b>{grosirMargin}%</b>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenEdit(
                      recipe || {
                        id: `rec-${prod.id}`,
                        productId: prod.id,
                        productName: prod.name,
                        yieldUnit: '1 Porsi',
                        ingredients: [],
                      }
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c1352d]/30 bg-[#c1352d]/10 hover:bg-[#c1352d] hover:text-white text-[#c1352d] font-bold text-xs transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Takaran Resep</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT RECIPE MODAL */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                  Edit Resep: {editingRecipe.productName}
                </h4>
                <p className="text-[10px] text-gray-500">
                  Atur bahan baku & jumlah gram/ml untuk perhitungan HPP otomatis
                </p>
              </div>
              <button
                onClick={() => setEditingRecipe(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {tempIngredients.map((ing, idx) => {
                const mat = materials.find(m => m.id === ing.materialId);
                const itemCost = mat ? ing.amount * mat.costPerUnit : 0;

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <select
                        value={ing.materialId}
                        onChange={e => handleUpdateIngredient(idx, 'materialId', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-semibold text-xs"
                      >
                        {materials.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} (Rp {m.costPerUnit.toLocaleString('id-ID')}/{m.unit})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-600"
                        title="Hapus bahan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500">Takaran:</span>
                        <input
                          type="number"
                          step="any"
                          value={ing.amount}
                          onChange={e =>
                            handleUpdateIngredient(idx, 'amount', Number(e.target.value))
                          }
                          className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-bold text-center text-xs"
                        />
                        <span className="font-bold text-xs">{ing.unit}</span>
                      </div>

                      <div className="font-bold text-xs text-[#c1352d]">
                        Biaya: Rp {Math.round(itemCost).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddIngredient}
                className="w-full py-2 rounded-xl border border-dashed border-[#c1352d]/40 text-[#c1352d] font-bold text-xs hover:bg-[#c1352d]/5 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Bahan Baku ke Resep</span>
              </button>
            </div>

            <div className="pt-3 border-t flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-500 block">Total Estimasi HPP</span>
                <span className="text-base font-black text-[#c1352d]">
                  Rp{' '}
                  {tempIngredients
                    .reduce((sum, ing) => {
                      const mat = materials.find(m => m.id === ing.materialId);
                      return sum + (mat ? ing.amount * mat.costPerUnit : 0);
                    }, 0)
                    .toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRecipe(null)}
                  className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveRecipe}
                  className="px-4 py-1.5 rounded-xl bg-[#c1352d] text-white font-bold hover:bg-[#a92b24]"
                >
                  Simpan Perubahan Resep
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
