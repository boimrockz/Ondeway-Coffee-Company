import React, { useState, useEffect } from 'react';
import {
  X,
  Banknote,
  QrCode,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, Transaction } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tx: Transaction) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    cart,
    cartTotal,
    cartSubtotal,
    promoDiscount,
    pointsDiscount,
    pointsEarned,
    selectedCustomer,
    orderType,
    tableNumber,
    completeTransaction,
  } = useApp();

  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [cashInput, setCashInput] = useState<number>(cartTotal);
  const [debitBank, setDebitBank] = useState<string>('BCA');
  const [debitRef, setDebitRef] = useState<string>('');
  const [tempoDays, setTempoDays] = useState<number>(14);

  // QRIS Simulation state
  const [qrisTimer, setQrisTimer] = useState<number>(900); // 15 mins in sec
  const [qrisStatus, setQrisStatus] = useState<'pending' | 'success'>('pending');

  useEffect(() => {
    setCashInput(cartTotal);
  }, [cartTotal]);

  // QRIS countdown timer
  useEffect(() => {
    if (!isOpen || method !== 'qris' || qrisStatus === 'success') return;
    const interval = setInterval(() => {
      setQrisTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, method, qrisStatus]);

  if (!isOpen) return null;

  const change = Math.max(0, cashInput - cartTotal);
  const isCashInsufficient = method === 'cash' && cashInput < cartTotal;

  // Preset cash shortcuts
  const cashShortcuts = [
    { label: 'Uang Pas', value: cartTotal },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 200.000', value: 200000 },
    { label: 'Rp 500.000', value: 500000 },
  ].filter(s => s.value >= cartTotal || s.label === 'Uang Pas');

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleProcessPayment = () => {
    if (isCashInsufficient) return;

    let dueDateStr: string | undefined = undefined;
    if (method === 'tempo') {
      const d = new Date();
      d.setDate(d.getDate() + tempoDays);
      dueDateStr = d.toISOString().slice(0, 10);
    }

    try {
      const tx = completeTransaction({
        paymentMethod: method,
        cashGiven: method === 'cash' ? cashInput : undefined,
        qrisRef: method === 'qris' ? `QRIS-ODW-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
        debitRef: method === 'debit' ? `${debitBank}-${debitRef || 'EDC9981'}` : undefined,
        tempoDueDate: dueDateStr,
      });

      onSuccess(tx);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Gagal memproses transaksi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#fffdf9] dark:bg-[#1a120e] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fdf8f0] dark:bg-[#201712]">
          <div>
            <h3 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
              Pembayaran & Selesaikan Pesanan
            </h3>
            <p className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80">
              {cart.reduce((s, i) => s + i.qty, 0)} Item ·{' '}
              {orderType === 'dine_in' ? `Dine In (Meja #${tableNumber})` : orderType === 'take_away' ? 'Take Away' : 'Delivery'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Summary Banner */}
        <div className="px-6 py-4 bg-linear-to-r from-[#c1352d]/10 via-[#c1352d]/5 to-transparent border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
              Total Tagihan
            </div>
            <div className="text-2xl font-black text-[#c1352d] tracking-tight">
              Rp {cartTotal.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-right text-xs space-y-0.5">
            {promoDiscount > 0 && (
              <div className="text-[#c1352d] font-bold">
                Hemat Rp {promoDiscount.toLocaleString('id-ID')} (Promo)
              </div>
            )}
            {pointsDiscount > 0 && (
              <div className="text-emerald-600 font-bold">
                Potongan Poin Rp {pointsDiscount.toLocaleString('id-ID')}
              </div>
            )}
            {pointsEarned > 0 && (
              <div className="text-emerald-700 font-semibold text-[11px]">
                +{pointsEarned} Poin akan didapatkan
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] mb-2 block">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'cash'
                    ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f6c4b8] font-bold shadow-xs'
                    : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-[#4a3227] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs">Tunai / Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('qris')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'qris'
                    ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f6c4b8] font-bold shadow-xs'
                    : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-[#4a3227] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs">QRIS Dinamis</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('debit')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'debit'
                    ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f6c4b8] font-bold shadow-xs'
                    : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-[#4a3227] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Debit / Kartu</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('tempo')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'tempo'
                    ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f6c4b8] font-bold shadow-xs'
                    : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-[#4a3227] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Tempo B2B</span>
              </button>
            </div>
          </div>

          {/* METHOD 1: CASH */}
          {method === 'cash' && (
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] block mb-1">
                  Uang Diterima dari Pelanggan (Rp)
                </label>
                <input
                  type="number"
                  value={cashInput || ''}
                  onChange={e => setCashInput(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full text-base font-extrabold px-3 py-2 rounded-xl border border-[#2a1a15]/20 dark:border-[#fdf8f0]/20 bg-[#fffdf9] dark:bg-[#1f1511] text-[#2a1a15] dark:text-[#fdf8f0] focus:outline-none focus:border-[#c1352d]"
                />
              </div>

              {/* Fast Presets */}
              <div className="flex flex-wrap gap-2">
                {cashShortcuts.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashInput(s.value)}
                    className="px-3 py-1.5 rounded-lg border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 hover:bg-[#c1352d]/10 text-xs font-semibold text-[#2a1a15] dark:text-[#edd6b4] transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Change Display */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isCashInsufficient
                    ? 'border-amber-400/40 bg-amber-500/10 text-amber-800 dark:text-amber-300'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                <div>
                  <div className="font-semibold text-[11px]">
                    {isCashInsufficient ? 'Uang Masih Kurang' : 'Kembalian Tunai'}
                  </div>
                  <div className="text-xl font-black">
                    Rp{' '}
                    {isCashInsufficient
                      ? (cartTotal - cashInput).toLocaleString('id-ID')
                      : change.toLocaleString('id-ID')}
                  </div>
                </div>
                {isCashInsufficient ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                )}
              </div>
            </div>
          )}

          {/* METHOD 2: QRIS */}
          {method === 'qris' && (
            <div className="space-y-3 pt-2 text-center text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#251b16] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 inline-block shadow-sm">
                {/* Simulated QR Code SVG */}
                <div className="relative w-44 h-44 mx-auto p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                  <svg className="w-full h-full text-gray-900" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    {/* Corner Position Detection Patterns */}
                    <rect x="5" y="5" width="26" height="26" fill="black" />
                    <rect x="9" y="9" width="18" height="18" fill="white" />
                    <rect x="13" y="13" width="10" height="10" fill="black" />

                    <rect x="69" y="5" width="26" height="26" fill="black" />
                    <rect x="73" y="9" width="18" height="18" fill="white" />
                    <rect x="77" y="13" width="10" height="10" fill="black" />

                    <rect x="5" y="69" width="26" height="26" fill="black" />
                    <rect x="9" y="73" width="18" height="18" fill="white" />
                    <rect x="13" y="77" width="10" height="10" fill="black" />

                    {/* QR Data Matrix Simulator */}
                    <circle cx="50" cy="50" r="10" fill="#c1352d" />
                    <rect x="40" y="20" width="8" height="8" fill="black" />
                    <rect x="54" y="20" width="8" height="8" fill="black" />
                    <rect x="36" y="72" width="10" height="6" fill="black" />
                    <rect x="54" y="66" width="12" height="8" fill="black" />
                    <rect x="74" y="52" width="16" height="6" fill="black" />
                    <rect x="74" y="72" width="10" height="12" fill="black" />
                    <rect x="20" y="44" width="8" height="8" fill="black" />
                  </svg>
                  {qrisStatus === 'success' && (
                    <div className="absolute inset-0 bg-emerald-600/90 rounded-lg flex flex-col items-center justify-center text-white">
                      <CheckCircle2 className="w-10 h-10 animate-bounce" />
                      <span className="text-xs font-bold mt-1">Lunas / Terverifikasi</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 font-mono font-bold text-xs text-[#2a1a15] dark:text-[#fdf8f0]">
                  NMID: ID1020088920199 ONDEWAY
                </div>
                <div className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/80">
                  Mendukung GoPay, OVO, ShopeePay, BCA, Dana, LinkAja
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/90">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Menunggu scan pembayaran · berlaku {formatTimer(qrisTimer)}</span>
              </div>

              {/* Simulation Quick Button for Barista */}
              <div>
                <button
                  type="button"
                  onClick={() => setQrisStatus('success')}
                  className="px-3 py-1.5 rounded-lg border border-[#c1352d]/30 bg-[#c1352d]/10 hover:bg-[#c1352d]/20 text-[#c1352d] dark:text-[#f6c4b8] text-[11px] font-bold transition-all"
                >
                  ⚡ Simulasikan Pembayaran QRIS Sukses
                </button>
              </div>
            </div>
          )}

          {/* METHOD 3: DEBIT */}
          {method === 'debit' && (
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] block mb-1">
                  Pilih Mesin EDC / Bank
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['BCA', 'Mandiri', 'BRI', 'BNI'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setDebitBank(b)}
                      className={`py-2 px-2 rounded-lg border font-bold text-center transition-all ${
                        debitBank === b
                          ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f6c4b8]'
                          : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-[#4a3227] dark:text-[#edd6b4]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] block mb-1">
                  Nomor Referensi EDC / Approval Code
                </label>
                <input
                  type="text"
                  value={debitRef}
                  onChange={e => setDebitRef(e.target.value)}
                  placeholder="Contoh: REF-881920 / TRACE-0012"
                  className="w-full px-3 py-2 rounded-xl border border-[#2a1a15]/20 dark:border-[#fdf8f0]/20 bg-[#fffdf9] dark:bg-[#1f1511] text-[#2a1a15] dark:text-[#fdf8f0] focus:outline-none focus:border-[#c1352d]"
                />
              </div>
            </div>
          )}

          {/* METHOD 4: TEMPO B2B */}
          {method === 'tempo' && (
            <div className="space-y-3 pt-2 text-xs">
              {selectedCustomer && selectedCustomer.type === 'b2b' ? (
                <>
                  <div className="p-3.5 rounded-xl bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 space-y-1">
                    <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                      Mitra B2B: {selectedCustomer.companyName || selectedCustomer.name}
                    </div>
                    <div className="flex justify-between text-[#7a5c4b] dark:text-[#edd6b4]/80 text-[11px]">
                      <span>Limit Kredit:</span>
                      <span className="font-semibold">
                        Rp {(selectedCustomer.creditLimit || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#7a5c4b] dark:text-[#edd6b4]/80 text-[11px]">
                      <span>Hutang Berjalan:</span>
                      <span className="font-semibold text-amber-700">
                        Rp {(selectedCustomer.currentDebt || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#2a1a15] dark:text-[#fdf8f0] font-bold text-[11px] pt-1 border-t border-[#2a1a15]/10">
                      <span>Sisa Plafon Kredit:</span>
                      <span className="text-emerald-700">
                        Rp{' '}
                        {Math.max(
                          0,
                          (selectedCustomer.creditLimit || 0) -
                            (selectedCustomer.currentDebt || 0) -
                            cartTotal
                        ).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] block mb-1">
                      Termin Pembayaran (Jatuh Tempo)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[7, 14, 30].map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setTempoDays(d)}
                          className={`py-2 px-2 rounded-lg border font-bold text-center transition-all ${
                            tempoDays === d
                              ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f6c4b8]'
                              : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-[#4a3227] dark:text-[#edd6b4]'
                          }`}
                        >
                          {d} Hari
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Perhatian: Fitur Tempo Khusus Mitra B2B</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    Silakan pilih pelanggan dengan status <b>Mitra Cafe B2B</b> atau{' '}
                    <b>Distributor</b> pada layar kasir sebelum memilih pembayaran tempo/invoicing.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Final Submit */}
        <div className="p-4 border-t border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fdf8f0] dark:bg-[#201712] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 text-xs font-semibold text-[#4a3227] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={
              isCashInsufficient ||
              (method === 'tempo' && (!selectedCustomer || selectedCustomer.type !== 'b2b'))
            }
            onClick={handleProcessPayment}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all ${
              isCashInsufficient ||
              (method === 'tempo' && (!selectedCustomer || selectedCustomer.type !== 'b2b'))
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#c1352d] hover:bg-[#a92b24]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Selesaikan & Cetak Struk (Rp {cartTotal.toLocaleString('id-ID')})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
