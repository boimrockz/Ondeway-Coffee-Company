import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  Coffee,
  ThumbsUp,
  Download,
  Share2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Transaction } from '../../types';

interface DigitalReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmitted?: (rating: number, comment: string) => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onFeedbackSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [tasteScore, setTasteScore] = useState<number>(5);
  const [speedScore, setSpeedScore] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onFeedbackSubmitted) {
      onFeedbackSubmitted(rating, comment);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#fffdf9] dark:bg-[#1a120e] rounded-3xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-[#c1352d] to-[#8b2320] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide">
                Struk Digital & Ulasan Pelanggan
              </h3>
              <p className="text-[11px] text-white/80">
                Ondeway Coffee Company · {transaction.invoiceNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Digital E-Receipt Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#221813] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-3">
            <div className="flex justify-between items-start border-b border-dashed pb-2.5 border-gray-300 dark:border-gray-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#c1352d]">
                  E-RECEIPT RESMI
                </span>
                <div className="font-extrabold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                  {transaction.outletName}
                </div>
                <div className="text-[10px] text-gray-500">
                  {transaction.date} · Kasir: {transaction.cashierName}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                Lunas ({transaction.paymentMethod.toUpperCase()})
              </span>
            </div>

            {/* Items */}
            <div className="space-y-1.5">
              {transaction.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span className="text-[#2a1a15] dark:text-[#fdf8f0]">
                    {it.name} <span className="text-gray-400">x{it.qty}</span>
                  </span>
                  <span className="font-bold">
                    Rp {it.totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-dashed border-gray-300 dark:border-gray-700 flex justify-between items-center text-xs">
              <span className="font-bold text-gray-600 dark:text-gray-400">TOTAL PEMBAYARAN</span>
              <span className="font-black text-base text-[#c1352d]">
                Rp {transaction.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Feedback Form Section */}
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmitFeedback}
              className="p-4 rounded-2xl bg-[#fdf8f0] dark:bg-[#201712] border border-[#c1352d]/20 space-y-4"
            >
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#c1352d]/10 text-[#c1352d] text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Dapatkan +10 Poin Loyalitas</span>
                </div>
                <h4 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                  Bagaimana Pengalaman Kopi Anda Hari Ini?
                </h4>
                <p className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80">
                  Ulasan Anda sangat berharga untuk menjaga kualitas seduhan barista Ondeway.
                </p>
              </div>

              {/* Star Rating Overall */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                  Kepuasan Keseluruhan:
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        className="w-7 h-7"
                        fill={star <= rating ? '#f0b429' : 'none'}
                        stroke="#f0b429"
                        strokeWidth={2}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific ratings */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Cita Rasa Kopi & Makanan
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTasteScore(s)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                          tasteScore === s
                            ? 'bg-[#c1352d] text-white border-[#c1352d]'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Kecepatan & Keramahan Barista
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSpeedScore(s)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                          speedScore === s
                            ? 'bg-[#c1352d] text-white border-[#c1352d]'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Kritik, Saran, atau Pujian untuk Barista (Opsional)
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Contoh: Kopi susu aren sangat pas manisnya, barista ramah sekali!"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a120e] text-xs focus:outline-none focus:border-[#c1352d]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#c1352d] text-white font-bold text-xs hover:bg-[#a92b24] shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Kirim Ulasan & Klaim Poin</span>
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                Terima Kasih Atas Ulasan Anda!
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto">
                Rating {rating} bintang Anda telah kami catat. Poin loyalitas sebesar <b>+10 Poin</b> telah
                berhasil ditambahkan ke profil membership Ondeway Anda.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
