import React, { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  SlidersHorizontal,
  Tag,
  Gift,
  Coins,
  ChevronRight,
  User,
  ShoppingBag,
  Sparkles,
  Percent,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory, ProductVariantOption, Transaction } from '../../types';
import { CustomizerModal } from './CustomizerModal';
import { CheckoutModal } from './CheckoutModal';
import { ReceiptModal } from './ReceiptModal';

const CATEGORIES: ('Semua' | ProductCategory)[] = [
  'Semua',
  'Espresso Based',
  'Manual Brew',
  'Signature Mocktail',
  'Non-Coffee',
  'Pastry & Food',
  'Whole Beans B2B',
];

export const PosTerminal: React.FC = () => {
  const {
    products,
    cart,
    addToCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
    cartSubtotal,
    promoDiscount,
    pointsDiscount,
    cartTotal,
    pointsEarned,
    cartTotalHPP,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    activePromo,
    applyPromoCode,
    removePromo,
    pointsToUse,
    setPointsToUse,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'Semua' | ProductCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  // Filter products by category and search
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Dynamic price resolution for product card display
  const getDisplayPrice = (p: Product) => {
    if (!selectedCustomer) return p.priceRetail;
    if (selectedCustomer.type === 'b2b') {
      if (selectedCustomer.tier === 'distributor' && p.priceDistributor) return p.priceDistributor;
      if (selectedCustomer.tier === 'grosir' && p.priceGrosir) return p.priceGrosir;
    }
    return p.priceRetail;
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ type: 'success', text: res.message });
      setPromoInput('');
    } else {
      setPromoMessage({ type: 'error', text: res.message });
    }
    setTimeout(() => setPromoMessage(null), 4000);
  };

  const handleCheckoutSuccess = (tx: Transaction) => {
    setCompletedTx(tx);
    setShowReceipt(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-5">
      {/* LEFT: PRODUCTS CATALOG & SEARCH */}
      <div className="flex-1 flex flex-col min-w-0 space-y-4">
        {/* Top Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5c4b] dark:text-[#edd6b4]/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari kopi, manual brew, resep..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-[#fffdf9] dark:bg-[#1a120e] text-[#2a1a15] dark:text-[#fdf8f0] focus:outline-none focus:border-[#c1352d]"
            />
          </div>

          {/* Customer indicator badge */}
          {selectedCustomer && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#c1352d]/10 border border-[#c1352d]/20 text-xs">
              <User className="w-3.5 h-3.5 text-[#c1352d]" />
              <div className="leading-tight">
                <span className="font-bold text-[#c1352d]">{selectedCustomer.name}</span>
                <span className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4] block">
                  {selectedCustomer.type === 'b2b'
                    ? `B2B · Harga Tier ${selectedCustomer.tier.toUpperCase()}`
                    : `B2C · Saldo ${selectedCustomer.points} Poin`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#c1352d] text-white shadow-xs'
                  : 'bg-[#fffdf9] dark:bg-[#201712] text-[#4a3227] dark:text-[#edd6b4] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 hover:border-[#c1352d]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredProducts.map(product => {
              const displayPrice = getDisplayPrice(product);
              const marginPercent = Math.round(
                ((displayPrice - product.costHPP) / displayPrice) * 100
              );

              return (
                <div
                  key={product.id}
                  className="group relative bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 overflow-hidden shadow-xs hover:shadow-md hover:border-[#c1352d]/40 transition-all flex flex-col"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100 dark:bg-black/30">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category pill */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      {product.category}
                    </span>

                    {/* Margin Badge */}
                    <span
                      className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                        marginPercent >= 65
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-amber-600/90 text-white'
                      }`}
                      title={`HPP Rp ${product.costHPP.toLocaleString('id-ID')} (${marginPercent}% margin)`}
                    >
                      {marginPercent}% HPP
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] line-clamp-1 group-hover:text-[#c1352d] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/70 line-clamp-2 mt-0.5">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#2a1a15]/5 dark:border-[#fdf8f0]/5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#9a8574] leading-none">
                          {selectedCustomer?.type === 'b2b' ? (
                            <span className="text-[#c1352d] font-bold">
                              Tier {selectedCustomer.tier}
                            </span>
                          ) : (
                            'Harga Ritel'
                          )}
                        </div>
                        <div className="text-xs font-extrabold text-[#c1352d] dark:text-[#f6c4b8]">
                          Rp {displayPrice.toLocaleString('id-ID')}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCustomizingProduct(product)}
                          className="p-1.5 rounded-lg border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#c1352d]/10 hover:text-[#c1352d] transition-colors"
                          title="Kustom varian & catatan"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="p-1.5 rounded-lg bg-[#c1352d] text-white hover:bg-[#a92b24] shadow-xs transition-colors"
                          title="Tambah langsung ke keranjang"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: REAL-TIME CART & ORDER PANEL */}
      <div
        id="pos-cart"
        className="w-full lg:w-96 bg-[#fffdf9] dark:bg-[#1a120e] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-sm flex flex-col shrink-0 overflow-hidden"
      >
        {/* Cart Header */}
        <div className="p-4 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fdf8f0] dark:bg-[#201712]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#c1352d]" />
              <h3 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                Pesanan Baru
              </h3>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c1352d]/10 text-[#c1352d]">
                {cart.reduce((s, i) => s + i.qty, 0)} item
              </span>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] font-semibold text-[#7a5c4b] hover:text-[#c1352d] transition-colors"
              >
                Kosongkan
              </button>
            )}
          </div>

          {/* Customer Selector */}
          <div className="space-y-2">
            <select
              value={selectedCustomer?.id || ''}
              onChange={e => {
                const found = customers.find(c => c.id === e.target.value);
                setSelectedCustomer(found || null);
              }}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] focus:outline-none focus:border-[#c1352d]"
            >
              <option value="">Pelanggan Umum (Walk-in Ritel)</option>
              <optgroup label="Member B2C (Loyalitas Poin)">
                {customers
                  .filter(c => c.type === 'b2c')
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {c.points} Poin
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Mitra B2B (Harga Grosir / Distributor)">
                {customers
                  .filter(c => c.type === 'b2b')
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} · Tier {c.tier.toUpperCase()}
                    </option>
                  ))}
              </optgroup>
            </select>

            {/* Order Type Tabs */}
            <div className="grid grid-cols-3 gap-1 p-0.5 rounded-xl bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`py-1 rounded-lg text-center transition-all ${
                  orderType === 'dine_in'
                    ? 'bg-white dark:bg-[#2a1a15] text-[#c1352d] shadow-xs'
                    : 'text-[#7a5c4b] dark:text-[#edd6b4]'
                }`}
              >
                Dine In
              </button>
              <button
                type="button"
                onClick={() => setOrderType('take_away')}
                className={`py-1 rounded-lg text-center transition-all ${
                  orderType === 'take_away'
                    ? 'bg-white dark:bg-[#2a1a15] text-[#c1352d] shadow-xs'
                    : 'text-[#7a5c4b] dark:text-[#edd6b4]'
                }`}
              >
                Take Away
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-1 rounded-lg text-center transition-all ${
                  orderType === 'delivery'
                    ? 'bg-white dark:bg-[#2a1a15] text-[#c1352d] shadow-xs'
                    : 'text-[#7a5c4b] dark:text-[#edd6b4]'
                }`}
              >
                Delivery
              </button>
            </div>

            {/* Table number selector if Dine In */}
            {orderType === 'dine_in' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-semibold text-[#7a5c4b] dark:text-[#edd6b4]">Nomor Meja:</span>
                <select
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  className="px-2 py-0.5 rounded-md border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] font-bold text-xs"
                >
                  {Array.from({ length: 16 }).map((_, i) => {
                    const num = (i + 1).toString().padStart(2, '0');
                    return (
                      <option key={num} value={num}>
                        Meja #{num}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Cart Item Lines */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-[#9a8574]">
              <ShoppingBag className="w-8 h-8 stroke-1 opacity-50 mb-2" />
              <p className="text-xs font-semibold">Keranjang masih kosong</p>
              <p className="text-[10px] opacity-75">Klik menu di sebelah kiri untuk menambah pesanan</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fffdf9] dark:bg-[#201712] space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] leading-tight">
                      {item.product.name}
                    </h5>
                    <div className="text-[10px] text-[#c1352d] font-semibold mt-0.5">
                      Rp {item.unitPrice.toLocaleString('id-ID')}
                      {item.extraCost > 0 && ` (+Rp ${item.extraCost.toLocaleString('id-ID')})`}
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-xs font-black text-[#2a1a15] dark:text-[#fdf8f0]">
                    Rp {item.totalPrice.toLocaleString('id-ID')}
                  </div>
                </div>

                {/* Modifiers detail */}
                {(item.variant.ice ||
                  item.variant.sugar ||
                  item.variant.milk ||
                  item.variant.extraShot ||
                  item.note) && (
                  <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/70 bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 p-1.5 rounded-md space-y-0.5">
                    <div>
                      {[
                        item.variant.ice,
                        item.variant.sugar,
                        item.variant.milk,
                        item.variant.extraShot ? 'Extra Shot' : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                    {item.note && <div className="italic">"{item.note}"</div>}
                  </div>
                )}

                {/* Qty controller & Delete */}
                <div className="flex items-center justify-between pt-1 border-t border-[#2a1a15]/5 dark:border-[#fdf8f0]/5">
                  <button
                    type="button"
                    onClick={() => removeCartItem(idx)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Hapus item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateCartItemQty(idx, -1)}
                      className="w-6 h-6 rounded-md bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 hover:bg-[#c1352d]/10 hover:text-[#c1352d] flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateCartItemQty(idx, 1)}
                      className="w-6 h-6 rounded-md bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 hover:bg-[#c1352d]/10 hover:text-[#c1352d] flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PROMO & POINTS ACCORDION */}
        <div className="p-3 border-t border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fdf8f0]/60 dark:bg-[#201712]/60 space-y-2 text-xs">
          {/* Promo Code Input */}
          <div>
            <form onSubmit={handleApplyPromo} className="flex gap-1.5">
              <input
                type="text"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Kode Promo (cth: HEMAT10K)"
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] text-xs font-mono font-semibold"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#c1352d] text-white font-bold text-xs hover:bg-[#a92b24]"
              >
                Gunakan
              </button>
            </form>

            {promoMessage && (
              <div
                className={`mt-1 text-[10px] font-semibold flex items-center gap-1 ${
                  promoMessage.type === 'success' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {promoMessage.type === 'success' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                <span>{promoMessage.text}</span>
              </div>
            )}

            {activePromo && (
              <div className="mt-1.5 flex items-center justify-between p-1.5 rounded-md bg-[#c1352d]/10 text-[#c1352d] text-[10px] font-bold">
                <span>
                  Kupon Aktif: {activePromo.code} (-Rp {promoDiscount.toLocaleString('id-ID')})
                </span>
                <button
                  type="button"
                  onClick={removePromo}
                  className="hover:underline text-gray-500"
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          {/* Loyalty Points Redemption (B2C) */}
          {selectedCustomer && selectedCustomer.type === 'b2c' && (
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between font-semibold text-[11px] text-emerald-800 dark:text-emerald-200">
                <span className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Tukar Poin Member</span>
                </span>
                <span>Saldo: {selectedCustomer.points} Poin</span>
              </div>

              {selectedCustomer.points > 0 ? (
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="number"
                    min={0}
                    max={selectedCustomer.points}
                    value={pointsToUse || ''}
                    onChange={e => setPointsToUse(Math.min(selectedCustomer.points, Number(e.target.value) || 0))}
                    placeholder="0"
                    className="flex-1 px-2 py-1 text-xs rounded border border-emerald-500/30 bg-white dark:bg-[#1a120e] text-[#2a1a15] dark:text-[#fdf8f0]"
                  />
                  <button
                    type="button"
                    onClick={() => setPointsToUse(selectedCustomer.points)}
                    className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                  >
                    Maks
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-emerald-700/80 mt-0.5">
                  Belum ada saldo poin untuk ditukarkan.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Cart Totals & Checkout Button */}
        <div className="p-4 border-t border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fdf8f0] dark:bg-[#201712] space-y-2">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-[#7a5c4b] dark:text-[#edd6b4]">
              <span>Subtotal</span>
              <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
            </div>

            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#c1352d] font-semibold">
                <span>Diskon Kupon Promo</span>
                <span>- Rp {promoDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}

            {pointsDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Tukar Poin Member</span>
                <span>- Rp {pointsDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-2 border-t border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
              <span className="font-extrabold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                TOTAL TAGIHAN
              </span>
              <span className="font-black text-xl text-[#c1352d] tracking-tight">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
              cart.length === 0
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-[#c1352d] text-white hover:bg-[#a92b24]'
            }`}
          >
            <span>Bayar Sekarang (Rp {cartTotal.toLocaleString('id-ID')})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODALS */}
      {customizingProduct && (
        <CustomizerModal
          product={customizingProduct}
          isOpen={!!customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAddToCart={(variant, note) => {
            addToCart(customizingProduct, variant, note);
          }}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {showReceipt && completedTx && (
        <ReceiptModal
          transaction={completedTx}
          isOpen={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setCompletedTx(null);
          }}
        />
      )}
    </div>
  );
};
