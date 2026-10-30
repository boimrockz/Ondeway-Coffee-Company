import React, { useState, useMemo } from 'react';
import {
  Coffee,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  TrendingUp,
  Tag,
  DollarSign,
  Package,
  X,
  Layers,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';

const CATEGORIES: ProductCategory[] = [
  'Espresso Based',
  'Manual Brew',
  'Signature Mocktail',
  'Non-Coffee',
  'Pastry & Food',
  'Whole Beans B2B',
];

const PRESET_IMAGES = [
  { label: 'Kopi Susu / Latte', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80' },
  { label: 'Cinnamon / Cappuccino', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80' },
  { label: 'Americano / Espresso', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },
  { label: 'Manual Brew V60', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80' },
  { label: 'Mocktail Segar', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
  { label: 'Matcha / Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80' },
  { label: 'Croissant / Pastry', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80' },
  { label: 'Whole Bean Bag', url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=400&q=80' },
];

export const MenuMasterData: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, recipes } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Espresso Based' as ProductCategory,
    description: '',
    image: PRESET_IMAGES[0].url,
    priceRetail: 25000,
    priceGrosir: 20000,
    priceDistributor: 17000,
    costHPP: 7500,
    unit: 'Cup 14oz',
    recipeId: '',
    isAvailable: true,
    isPopular: false,
  });

  // Calculate stats
  const totalProducts = products.length;
  const availableCount = products.filter(p => p.isAvailable).length;
  const popularCount = products.filter(p => p.isPopular).length;
  
  const avgMargin = useMemo(() => {
    if (products.length === 0) return 0;
    const totalMargin = products.reduce((acc, p) => {
      const margin = p.priceRetail > 0 ? ((p.priceRetail - p.costHPP) / p.priceRetail) * 100 : 0;
      return acc + margin;
    }, 0);
    return Math.round(totalMargin / products.length);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchAvail =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && p.isAvailable) ||
        (availabilityFilter === 'unavailable' && !p.isAvailable);
      return matchSearch && matchCat && matchAvail;
    });
  }, [products, searchQuery, selectedCategory, availabilityFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      code: `ODW-${Date.now().toString().slice(-4)}`,
      name: '',
      category: 'Espresso Based',
      description: '',
      image: PRESET_IMAGES[0].url,
      priceRetail: 25000,
      priceGrosir: 20000,
      priceDistributor: 17000,
      costHPP: 7500,
      unit: 'Cup 14oz',
      recipeId: '',
      isAvailable: true,
      isPopular: false,
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      code: p.code,
      name: p.name,
      category: p.category,
      description: p.description,
      image: p.image,
      priceRetail: p.priceRetail,
      priceGrosir: p.priceGrosir,
      priceDistributor: p.priceDistributor,
      costHPP: p.costHPP,
      unit: p.unit,
      recipeId: p.recipeId || '',
      isAvailable: p.isAvailable,
      isPopular: !!p.isPopular,
    });
    setShowAddEditModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        code: formData.code,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        image: formData.image,
        priceRetail: Number(formData.priceRetail),
        priceGrosir: Number(formData.priceGrosir),
        priceDistributor: Number(formData.priceDistributor),
        costHPP: Number(formData.costHPP),
        unit: formData.unit,
        recipeId: formData.recipeId || undefined,
        isAvailable: formData.isAvailable,
        isPopular: formData.isPopular,
      });
    } else {
      addProduct({
        code: formData.code,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        image: formData.image,
        priceRetail: Number(formData.priceRetail),
        priceGrosir: Number(formData.priceGrosir),
        priceDistributor: Number(formData.priceDistributor),
        costHPP: Number(formData.costHPP),
        unit: formData.unit,
        recipeId: formData.recipeId || undefined,
        isAvailable: formData.isAvailable,
        isPopular: formData.isPopular,
      });
    }
    setShowAddEditModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus produk "${name}" dari Master Data Menu?`)) {
      deleteProduct(id);
    }
  };

  const handleToggleAvailable = (p: Product) => {
    updateProduct(p.id, { isAvailable: !p.isAvailable });
  };

  const handleTogglePopular = (p: Product) => {
    updateProduct(p.id, { isPopular: !p.isPopular });
  };

  const handleExportCSV = () => {
    const headers = ['Kode SKU,Nama Menu,Kategori,Satuan,Harga Retail (Rp),Harga Grosir (Rp),Harga Distributor (Rp),HPP (Rp),Margin Kotor %,Tersedia,Populer'];
    const rows = products.map(p => {
      const margin = p.priceRetail > 0 ? (((p.priceRetail - p.costHPP) / p.priceRetail) * 100).toFixed(1) : '0';
      return `"${p.code}","${p.name.replace(/"/g, '""')}","${p.category}","${p.unit}",${p.priceRetail},${p.priceGrosir},${p.priceDistributor},${p.costHPP},${margin}%,"${p.isAvailable ? 'Ya' : 'Tidak'}","${p.isPopular ? 'Ya' : 'Tidak'}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Data_Menu_Ondeway_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Preview margin calculation in form
  const formMarginPercent = formData.priceRetail > 0
    ? Math.round(((formData.priceRetail - formData.costHPP) / formData.priceRetail) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-[#c1352d]/15 via-[#cf7440]/10 to-transparent p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c1352d] uppercase tracking-wider mb-1">
            <Coffee className="w-4 h-4" />
            <span>Master Data · Ondeway Coffee Company</span>
          </div>
          <h2 className="text-xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
            Master Data Menu & Katalog Produk
          </h2>
          <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1 max-w-2xl leading-relaxed">
            Pusat konfigurasi seluruh varian menu minuman, pastry, dan whole bean. Kelola harga bertingkat (Retail B2C, Grosir B2B, Distributor), biaya HPP resep, dan ketersediaan live di POS Kasir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white/60 dark:bg-[#201712]/60 hover:bg-white dark:hover:bg-[#251b16] text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#c1352d]" />
            <span>Ekspor CSV</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#c1352d] text-white hover:bg-[#a92b24] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Menu Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#c1352d]/10 text-[#c1352d] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
              {totalProducts}
            </div>
            <div className="text-[11px] font-semibold text-gray-500">
              Total Menu Terdaftar
            </div>
          </div>
        </div>

        <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {availableCount}
            </div>
            <div className="text-[11px] font-semibold text-gray-500">
              Menu Aktif di POS Kasir
            </div>
          </div>
        </div>

        <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
              {avgMargin}%
            </div>
            <div className="text-[11px] font-semibold text-gray-500">
              Rata-rata Margin Kotor
            </div>
          </div>
        </div>

        <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
              {popularCount}
            </div>
            <div className="text-[11px] font-semibold text-gray-500">
              Varian Unggulan (Best Seller)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari menu, SKU, atau deskripsi..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#251b16] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#c1352d]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={availabilityFilter}
              onChange={e => setAvailabilityFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#251b16] text-xs font-semibold text-[#2a1a15] dark:text-[#fdf8f0]"
            >
              <option value="all">Semua Status</option>
              <option value="available">Tersedia (Ready)</option>
              <option value="unavailable">Habis (Sold Out)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-[#251b16] text-[#c1352d] shadow-2xs'
                    : 'text-gray-500'
                }`}
              >
                Tabel Rinci
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-[#251b16] text-[#c1352d] shadow-2xs'
                    : 'text-gray-500'
                }`}
              >
                Kartu Visual
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#c1352d] text-white border-[#c1352d] shadow-2xs'
                : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Semua Kategori ({products.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#c1352d] text-white border-[#c1352d] shadow-2xs'
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 font-bold uppercase tracking-wider text-[10px] text-gray-500">
                <tr>
                  <th className="py-3 px-4">Menu & SKU</th>
                  <th className="py-3 px-4">Kategori & Satuan</th>
                  <th className="py-3 px-4 text-right">Retail (B2C)</th>
                  <th className="py-3 px-4 text-right">Grosir (B2B)</th>
                  <th className="py-3 px-4 text-right">Distributor</th>
                  <th className="py-3 px-4 text-right">Biaya HPP</th>
                  <th className="py-3 px-4 text-right">Margin %</th>
                  <th className="py-3 px-4 text-center">Status POS</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a1a15]/5 dark:divide-[#fdf8f0]/5">
                {filteredProducts.map(p => {
                  const marginPercent = p.priceRetail > 0
                    ? Math.round(((p.priceRetail - p.costHPP) / p.priceRetail) * 100)
                    : 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#2a1a15]/2 dark:hover:bg-[#fdf8f0]/2 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] text-xs">
                                {p.name}
                              </span>
                              {p.isPopular && (
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                              )}
                            </div>
                            <div className="font-mono text-[10px] text-gray-400 mt-0.5">
                              {p.code}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#c1352d]/10 text-[#c1352d] mb-0.5">
                          {p.category}
                        </span>
                        <div className="text-[10px] text-gray-400 font-semibold">{p.unit}</div>
                      </td>

                      <td className="py-3 px-4 text-right font-black text-[#2a1a15] dark:text-[#fdf8f0]">
                        Rp {p.priceRetail.toLocaleString('id-ID')}
                      </td>

                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300 font-medium">
                        Rp {p.priceGrosir.toLocaleString('id-ID')}
                      </td>

                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300 font-medium">
                        Rp {p.priceDistributor.toLocaleString('id-ID')}
                      </td>

                      <td className="py-3 px-4 text-right text-gray-500">
                        Rp {p.costHPP.toLocaleString('id-ID')}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            marginPercent >= 65
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                              : marginPercent >= 50
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                              : 'bg-red-500/10 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {marginPercent}%
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailable(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            p.isAvailable
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20'
                          }`}
                        >
                          {p.isAvailable ? '✓ Tersedia' : '✕ Habis'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePopular(p)}
                            title={p.isPopular ? 'Hapus dari Best Seller' : 'Tandai Best Seller'}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              p.isPopular
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-600'
                                : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:text-amber-500'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Menu"
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Hapus Menu"
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(p => {
            const marginPercent = p.priceRetail > 0
              ? Math.round(((p.priceRetail - p.costHPP) / p.priceRetail) * 100)
              : 0;

            return (
              <div
                key={p.id}
                className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 overflow-hidden shadow-xs hover:border-[#c1352d]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-black/70 backdrop-blur-xs text-white">
                        {p.category}
                      </span>
                      {p.isPopular && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 fill-white" />
                          <span>Favorit</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleAvailable(p)}
                      className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-sm ${
                        p.isAvailable
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {p.isAvailable ? 'Tersedia' : 'Habis'}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <span className="font-mono text-[10px] text-gray-400 block">{p.code}</span>
                        <h4 className="font-black text-sm text-[#2a1a15] dark:text-[#fdf8f0] line-clamp-1">
                          {p.name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Price Tiers */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-[11px]">Retail (B2C):</span>
                        <span className="font-black text-[#c1352d] text-sm">
                          Rp {p.priceRetail.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-gray-500">
                        <span>Grosir (B2B):</span>
                        <span className="font-semibold text-[#2a1a15] dark:text-[#fdf8f0]">
                          Rp {p.priceGrosir.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-gray-500">
                        <span>Distributor:</span>
                        <span className="font-semibold text-[#2a1a15] dark:text-[#fdf8f0]">
                          Rp {p.priceDistributor.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Cost & Margin info */}
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#251b16] flex justify-between items-center text-[11px]">
                      <span className="text-gray-500">HPP: Rp {p.costHPP.toLocaleString('id-ID')}</span>
                      <span className="font-bold text-emerald-600">Margin {marginPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 bg-gray-50/70 dark:bg-[#1a130f] border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleTogglePopular(p)}
                    className={`text-xs font-bold flex items-center gap-1 ${
                      p.isPopular ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{p.isPopular ? 'Favorit' : 'Set Favorit'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Menu Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffdf9] dark:bg-[#1e1612] w-full max-w-2xl rounded-3xl border border-[#2a1a15]/20 dark:border-[#fdf8f0]/20 shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-linear-to-r from-[#c1352d]/15 to-transparent border-b border-[#2a1a15]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#c1352d]" />
                <h3 className="font-black text-base text-[#2a1a15] dark:text-[#fdf8f0]">
                  {editingProduct ? 'Edit Master Data Menu' : 'Tambah Menu & Produk Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddEditModal(false)}
                className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Kode SKU / Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="ODW-ES-05"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-mono text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Nama Menu Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Ondeway Roasted Almond Latte"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Kategori Menu *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Satuan Saji (Unit)
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Cup 14oz / Pcs / Bag 1kg"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                  />
                </div>
              </div>

              {/* Pricing Tiers Section */}
              <div className="p-3.5 rounded-2xl bg-linear-to-br from-amber-500/5 via-[#c1352d]/5 to-transparent border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#c1352d]" />
                    <span>Konfigurasi 3-Tier Harga & Biaya HPP</span>
                  </span>
                  <span className="text-[11px] font-black text-emerald-600">
                    Gross Margin: {formMarginPercent}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                      Retail B2C (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={formData.priceRetail}
                      onChange={e => setFormData({ ...formData, priceRetail: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-bold text-[#c1352d]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                      Grosir B2B (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={formData.priceGrosir}
                      onChange={e => setFormData({ ...formData, priceGrosir: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                      Distributor B2B (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={formData.priceDistributor}
                      onChange={e => setFormData({ ...formData, priceDistributor: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                      Biaya Pokok (HPP Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={formData.costHPP}
                      onChange={e => setFormData({ ...formData, costHPP: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Image & Preset selection */}
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Foto Produk (Pilih Preset Cepat atau Masukkan URL)
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: preset.url })}
                      className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                        formData.image === preset.url
                          ? 'border-[#c1352d] ring-2 ring-[#c1352d]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-12 h-12 rounded-lg object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Deskripsi Menu & Karakter Rasa
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Penjelasan bahan, rasa, dan keunggulan menu..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-[#c1352d] focus:ring-[#c1352d]"
                  />
                  <span>Tersedia Langsung di POS Kasir</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-[#c1352d] focus:ring-[#c1352d]"
                  />
                  <span>Tandai Menu Favorit (Best Seller)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c1352d] text-white text-xs font-bold hover:bg-[#a92b24] shadow-sm"
                >
                  {editingProduct ? 'Simpan Perubahan Menu' : 'Simpan Menu Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
