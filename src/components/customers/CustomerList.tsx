import React, { useState } from 'react';
import {
  Users,
  Plus,
  Coins,
  Building2,
  Phone,
  Mail,
  Search,
  Filter,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerType, CustomerTier } from '../../types';

export const CustomerList: React.FC = () => {
  const { customers, addCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'b2c' | 'b2b'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<CustomerType>('b2c');
  const [tier, setTier] = useState<CustomerTier>('retail');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [creditLimit, setCreditLimit] = useState<number>(5000000);

  const filtered = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.companyName && c.companyName.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addCustomer({
      name,
      phone,
      email: email || undefined,
      type,
      tier,
      companyName: type === 'b2b' ? companyName : undefined,
      taxId: type === 'b2b' ? taxId : undefined,
      creditLimit: type === 'b2b' ? creditLimit : undefined,
      currentDebt: 0,
    });

    setShowAddModal(false);
    setName('');
    setPhone('');
    setEmail('');
    setCompanyName('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
            Total Member B2C Terdaftar
          </div>
          <div className="text-xl font-black text-[#c1352d] mt-1">
            {customers.filter(c => c.type === 'b2c').length} Pelanggan
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Akumulasi loyalitas poin belanja otomatis
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
            Mitra Roastery & Cafe B2B
          </div>
          <div className="text-xl font-black text-[#2a1a15] dark:text-[#fdf8f0] mt-1">
            {customers.filter(c => c.type === 'b2b').length} Mitra
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Tier Grosir & Distributor + Invoicing tempo
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
              Integrasi Kasir (POS)
            </div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              ✓ Harga Tier & Poin Otomatis
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#c1352d] text-white text-xs font-bold hover:bg-[#a92b24] shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-[#fffdf9] dark:bg-[#1e1612] p-3 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5c4b] dark:text-[#edd6b4]/70" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama pelanggan, no telp, perusahaan..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0] focus:outline-none focus:border-[#c1352d]"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {(['all', 'b2c', 'b2b'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setTypeFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                typeFilter === tab
                  ? 'bg-[#c1352d] text-white shadow-xs'
                  : 'bg-white dark:bg-[#251b16] text-[#7a5c4b] dark:text-[#edd6b4] border border-[#2a1a15]/10'
              }`}
            >
              {tab === 'all'
                ? 'Semua Pelanggan'
                : tab === 'b2c'
                ? 'Member Ritel B2C'
                : 'Mitra Roastery B2B'}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map(c => (
          <div
            key={c.id}
            className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] line-clamp-1">
                    {c.name}
                  </h4>
                  {c.companyName && (
                    <div className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80 font-medium">
                      {c.companyName}
                    </div>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                    c.type === 'b2b'
                      ? 'bg-[#c1352d]/10 text-[#c1352d]'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {c.type === 'b2b' ? `B2B · ${c.tier}` : 'B2C Member'}
                </span>
              </div>

              <div className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/70 space-y-1 mt-2.5">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{c.phone}</span>
                </div>
                {c.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{c.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial / Points Info */}
            <div className="p-2.5 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 text-xs space-y-1">
              {c.type === 'b2c' ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-gray-500">Saldo Poin:</span>
                    <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{c.points} Poin</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Total Belanja:</span>
                    <span className="font-semibold">
                      Rp {c.totalSpend.toLocaleString('id-ID')}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Limit Plafon Kredit:</span>
                    <span className="font-semibold">
                      Rp {(c.creditLimit || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Hutang Berjalan:</span>
                    <span className="font-bold text-amber-700">
                      Rp {(c.currentDebt || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateCustomer}
            className="w-full max-w-lg bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b">
              <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                Tambah Pelanggan Baru
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
                <label className="font-bold block mb-1">Tipe Pelanggan</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as CustomerType)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-semibold text-xs"
                >
                  <option value="b2c">Member Ritel B2C</option>
                  <option value="b2b">Mitra Roastery B2B</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Tier Harga</label>
                <select
                  value={tier}
                  onChange={e => setTier(e.target.value as CustomerTier)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-semibold text-xs"
                >
                  <option value="retail">Retail</option>
                  <option value="grosir">Grosir (Cafe Partner)</option>
                  <option value="distributor">Distributor Resmi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Nama Lengkap / PIC</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Hendra Kusuma"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-semibold text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">No. WhatsApp / HP</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                />
              </div>
            </div>

            {type === 'b2b' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Nama Badan Usaha / Cafe</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="PT Rasa Kopi Nusantara"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">NPWP Perusahaan</label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={e => setTaxId(e.target.value)}
                      placeholder="01.234.567.8-000.000"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Limit Plafon Kredit / Tempo (Rp)</label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={e => setCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-bold"
                  />
                </div>
              </>
            )}

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
                Simpan Pelanggan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
