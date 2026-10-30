import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Product, ProductVariantOption } from '../../types';

interface CustomizerModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (variant: ProductVariantOption, note: string) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [ice, setIce] = useState<ProductVariantOption['ice']>('Normal Ice');
  const [sugar, setSugar] = useState<ProductVariantOption['sugar']>('Normal Sweet (100%)');
  const [milk, setMilk] = useState<ProductVariantOption['milk']>('Regular Fresh Milk');
  const [extraShot, setExtraShot] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const isCoffeeOrDrink =
    product.category === 'Espresso Based' ||
    product.category === 'Manual Brew' ||
    product.category === 'Signature Mocktail' ||
    product.category === 'Non-Coffee';

  const isEspressoOrMilkDrink =
    product.category === 'Espresso Based' || product.category === 'Non-Coffee';

  let extraPrice = 0;
  if (milk === 'Oat Milk (+Rp 7.000)') extraPrice += 7000;
  if (milk === 'Almond Milk (+Rp 8.000)') extraPrice += 8000;
  if (extraShot) extraPrice += 5000;

  const finalSinglePrice = product.priceRetail + extraPrice;

  const handleConfirm = () => {
    onAddToCart(
      {
        ice,
        sugar,
        milk: isEspressoOrMilkDrink ? milk : undefined,
        extraShot: isCoffeeOrDrink ? extraShot : false,
      },
      note
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#fffdf9] dark:bg-[#201712] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fdf8f0] dark:bg-[#19120e]">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 object-cover rounded-xl border border-[#2a1a15]/10"
            />
            <div>
              <h3 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                {product.name}
              </h3>
              <p className="text-xs text-[#c1352d] font-bold">
                Rp {finalSinglePrice.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Temperature & Ice */}
          {isCoffeeOrDrink && (
            <div>
              <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] mb-2 flex items-center justify-between">
                <span>Pilihan Suhu & Es</span>
                <span className="text-[10px] text-[#9a8574]">Wajib pilih satu</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Normal Ice', 'Less Ice', 'No Ice', 'Hot'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setIce(opt)}
                    className={`py-2 px-2.5 rounded-lg border font-semibold text-center transition-all ${
                      ice === opt
                        ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f6c4b8]'
                        : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-[#4a3227] dark:text-[#edd6b4]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sweetness */}
          {isCoffeeOrDrink && (
            <div>
              <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] mb-2">
                Tingkat Kemanisan (Sweetness)
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    'Normal Sweet (100%)',
                    'Less Sweet (50%)',
                    'No Sugar (0%)',
                    'Extra Sweet',
                  ] as const
                ).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSugar(opt)}
                    className={`py-2 px-2.5 rounded-lg border font-semibold text-left transition-all ${
                      sugar === opt
                        ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f6c4b8]'
                        : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-[#4a3227] dark:text-[#edd6b4]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Milk Options */}
          {isEspressoOrMilkDrink && (
            <div>
              <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] mb-2">
                Opsi Susu (Milk Substitutes)
              </div>
              <div className="space-y-1.5">
                {(
                  [
                    'Regular Fresh Milk',
                    'Oat Milk (+Rp 7.000)',
                    'Almond Milk (+Rp 8.000)',
                  ] as const
                ).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMilk(opt)}
                    className={`w-full py-2 px-3 rounded-lg border font-semibold flex items-center justify-between transition-all ${
                      milk === opt
                        ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f6c4b8]'
                        : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-[#4a3227] dark:text-[#edd6b4]'
                    }`}
                  >
                    <span>{opt}</span>
                    {milk === opt && <Check className="w-4 h-4 text-[#c1352d]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons: Extra Shot */}
          {isCoffeeOrDrink && (
            <div>
              <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] mb-2">
                Tambahan (Add-Ons)
              </div>
              <label className="flex items-center justify-between p-3 rounded-lg border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 cursor-pointer hover:bg-[#c1352d]/5">
                <div>
                  <span className="font-semibold text-[#2a1a15] dark:text-[#fdf8f0]">
                    Extra Espresso Shot (18g Ondeway Blend)
                  </span>
                  <p className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/70">
                    Ekstra ekstraksi untuk rasa kopi lebih mantap
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#c1352d]">+Rp 5.000</span>
                  <input
                    type="checkbox"
                    checked={extraShot}
                    onChange={e => setExtraShot(e.target.checked)}
                    className="w-4 h-4 rounded text-[#c1352d] focus:ring-[#c1352d]"
                  />
                </div>
              </label>
            </div>
          )}

          {/* Notes */}
          <div>
            <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] mb-1.5">
              Catatan Khusus Barista
            </div>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Contoh: jangan pakai sedotan, latte art angsa, dll."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-[#fffdf9] dark:bg-[#1a120e] text-[#2a1a15] dark:text-[#fdf8f0] focus:outline-none focus:border-[#c1352d]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fdf8f0] dark:bg-[#19120e] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/80">Total Harga</div>
            <div className="text-sm font-extrabold text-[#c1352d]">
              Rp {finalSinglePrice.toLocaleString('id-ID')}
            </div>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-[#c1352d] text-white font-bold text-xs hover:bg-[#a92b24] shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Masukkan Pesanan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
