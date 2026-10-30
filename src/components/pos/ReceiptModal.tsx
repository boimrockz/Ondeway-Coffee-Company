import React, { useState, useEffect } from 'react';
import { X, Printer, Copy, Check, FileText, Download, QrCode, ExternalLink, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import { Transaction } from '../../types';
import { DigitalReceiptModal } from './DigitalReceiptModal';

interface ReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const [paperWidth, setPaperWidth] = useState<'58' | '80'>('58');
  const [ticketMode, setTicketMode] = useState<'customer' | 'kitchen'>('customer');
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showDigitalModal, setShowDigitalModal] = useState(false);

  // Generate dynamic QR code for digital copy & customer feedback form
  useEffect(() => {
    if (!transaction) return;
    const feedbackUrl = `${window.location.origin}/?receipt=${encodeURIComponent(
      transaction.invoiceNo
    )}#feedback`;

    QRCode.toDataURL(feedbackUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Failed to generate dynamic receipt QR code', err));
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    const receiptElement = document.getElementById('printable-receipt');

    if (!receiptElement) {
      window.print();
      setIsPrinting(false);
      return;
    }

    // Create an isolated printing iframe to guarantee clean thermal printer output
    const printIframe = document.createElement('iframe');
    printIframe.id = 'thermal-print-frame';
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    printIframe.style.visibility = 'hidden';
    document.body.appendChild(printIframe);

    const targetWidth = paperWidth === '80' ? '80mm' : '58mm';
    const printableWidth = paperWidth === '80' ? '72mm' : '48mm';

    const iframeDoc = printIframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Struk Ondeway - ${transaction.invoiceNo}</title>
            <style>
              @page {
                size: ${targetWidth} auto;
                margin: 0mm;
              }
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                background: #ffffff;
                color: #000000;
                font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
                font-size: ${paperWidth === '80' ? '12px' : '10.5px'};
                line-height: 1.35;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              * {
                box-sizing: border-box;
              }
              .thermal-container {
                width: ${printableWidth};
                margin: 0 auto;
                padding: 6px 4px;
                background: #fff;
              }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .font-bold, .font-extrabold, .font-black { font-weight: 700; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .items-center { align-items: center; }
              .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
              .border-b { border-bottom: 1px dashed #444; }
              .border-t { border-top: 1px dashed #444; }
              .border-b-2 { border-bottom: 2px solid #000; }
              .border-dashed { border-style: dashed; }
              .py-1 { padding-top: 3px; padding-bottom: 3px; }
              .py-2 { padding-top: 5px; padding-bottom: 5px; }
              .py-2\\.5 { padding-top: 6px; padding-bottom: 6px; }
              .py-3 { padding-top: 8px; padding-bottom: 8px; }
              .pt-1 { padding-top: 3px; }
              .pt-2 { padding-top: 6px; }
              .pt-3 { padding-top: 8px; }
              .pb-2 { padding-bottom: 6px; }
              .pb-3 { padding-bottom: 8px; }
              .pl-2 { padding-left: 6px; }
              .space-y-0\\.5 > * + * { margin-top: 2px; }
              .space-y-1 > * + * { margin-top: 3px; }
              .space-y-1\\.5 > * + * { margin-top: 4px; }
              .space-y-2 > * + * { margin-top: 6px; }
              .space-y-3 > * + * { margin-top: 8px; }
              .text-xs { font-size: ${paperWidth === '80' ? '12px' : '10.5px'}; }
              .text-sm { font-size: ${paperWidth === '80' ? '14px' : '12px'}; }
              .text-\\[10px\\] { font-size: 9.5px; }
              .text-\\[9px\\] { font-size: 8.5px; }
              .text-\\[8px\\] { font-size: 8px; }
              .italic { font-style: italic; }
              .uppercase { text-transform: uppercase; }
              .tracking-widest { letter-spacing: 0.15em; }
            </style>
          </head>
          <body>
            <div class="thermal-container">
              ${receiptElement.innerHTML}
            </div>
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        try {
          printIframe.contentWindow?.focus();
          printIframe.contentWindow?.print();
        } catch (e) {
          console.error('Iframe print error, falling back to window.print', e);
          window.print();
        } finally {
          setIsPrinting(false);
          setTimeout(() => {
            if (document.body.contains(printIframe)) {
              document.body.removeChild(printIframe);
            }
          }, 1500);
        }
      }, 300);
    } else {
      window.print();
      setIsPrinting(false);
    }
  };

  const handleCopyText = () => {
    const lines = [
      '================================',
      '      ONDEWAY COFFEE COMPANY    ',
      '   Roastery & Artisanal Coffee  ',
      '================================',
      `Invoice: ${transaction.invoiceNo}`,
      `Tanggal: ${transaction.date}`,
      `Kasir  : ${transaction.cashierName}`,
      `Outlet : ${transaction.outletName}`,
      `Tipe   : ${transaction.orderType.toUpperCase()} ${transaction.tableNumber ? `(Meja ${transaction.tableNumber})` : ''}`,
      `Pelanggan: ${transaction.customerName}`,
      '--------------------------------',
      ...transaction.items.map(
        i => `${i.name} x${i.qty}  Rp ${i.totalPrice.toLocaleString('id-ID')}`
      ),
      '--------------------------------',
      `Subtotal  : Rp ${transaction.subtotal.toLocaleString('id-ID')}`,
      transaction.promoDiscount
        ? `Diskon    : -Rp ${transaction.promoDiscount.toLocaleString('id-ID')}`
        : '',
      transaction.pointsDiscount
        ? `Poin Tukar: -Rp ${transaction.pointsDiscount.toLocaleString('id-ID')}`
        : '',
      `TOTAL     : Rp ${transaction.total.toLocaleString('id-ID')}`,
      `Metode    : ${transaction.paymentMethod.toUpperCase()}`,
      transaction.cashGiven
        ? `Tunai Diterima: Rp ${transaction.cashGiven.toLocaleString('id-ID')}`
        : '',
      transaction.changeGiven
        ? `Kembalian     : Rp ${transaction.changeGiven.toLocaleString('id-ID')}`
        : '',
      '================================',
      ' Terima Kasih Atas Kunjungan Anda',
      '  ondeway.co.id · @ondewaycoffee ',
      '================================',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#fffdf9] dark:bg-[#1a120e] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Top Controls */}
        <div className="flex items-center justify-between p-3.5 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fdf8f0] dark:bg-[#201712]">
          <div className="flex items-center gap-1.5 bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTicketMode('customer')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                ticketMode === 'customer'
                  ? 'bg-white dark:bg-[#2a1a15] text-[#c1352d] shadow-xs'
                  : 'text-[#7a5c4b] dark:text-[#edd6b4]'
              }`}
            >
              Struk Pelanggan
            </button>
            <button
              type="button"
              onClick={() => setTicketMode('kitchen')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                ticketMode === 'kitchen'
                  ? 'bg-white dark:bg-[#2a1a15] text-[#c1352d] shadow-xs'
                  : 'text-[#7a5c4b] dark:text-[#edd6b4]'
              }`}
            >
              Tiket Dapur / Bar
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={paperWidth}
              onChange={e => setPaperWidth(e.target.value as '58' | '80')}
              className="text-xs px-2 py-1 rounded-md border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white dark:bg-[#251b16] text-[#2a1a15] dark:text-[#fdf8f0]"
            >
              <option value="58">58 mm</option>
              <option value="80">80 mm</option>
            </select>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#7a5c4b] hover:bg-[#2a1a15]/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thermal Receipt Paper Viewport */}
        <div className="relative flex-1 overflow-y-auto p-4 bg-[#e9e3da] dark:bg-[#0f0b09] flex justify-center">
          {/* Floating 'Print Receipt' Button */}
          <div className="sticky top-4 right-4 self-start ml-auto z-20 pointer-events-auto">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#c1352d] text-white font-extrabold text-xs shadow-xl hover:bg-[#a92b24] hover:scale-105 active:scale-95 transition-all border-2 border-white dark:border-[#2a1a15] ring-2 ring-[#c1352d]/30"
              title="Print receipt specifically for thermal printers"
            >
              <Printer className={`w-3.5 h-3.5 ${isPrinting ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
              <span>{isPrinting ? 'Printing…' : 'Print Receipt'}</span>
            </button>
          </div>

          <div
            id="printable-receipt"
            className={`bg-white text-[#111] p-5 shadow-lg font-mono text-[11px] leading-relaxed transition-all select-none ${
              paperWidth === '58' ? 'w-[280px]' : 'w-[360px]'
            } border-t-4 border-[#c1352d]`}
          >
            {ticketMode === 'customer' ? (
              /* CUSTOMER RECEIPT */
              <div>
                <div className="text-center pb-3 border-b border-dashed border-gray-400 space-y-0.5">
                  <div className="font-extrabold text-sm tracking-widest text-[#c1352d]">
                    ONDEWAY
                  </div>
                  <div className="font-semibold text-[10px] text-gray-700">
                    COFFEE COMPANY · ROASTERY
                  </div>
                  <div className="text-[9px] text-gray-500">{transaction.outletName}</div>
                  <div className="text-[9px] text-gray-500">Senopati - Kemang - BSD</div>
                </div>

                <div className="py-2.5 border-b border-dashed border-gray-400 text-[10px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>No: {transaction.invoiceNo}</span>
                    <span>{transaction.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kasir: {transaction.cashierName}</span>
                    <span>{transaction.date.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Order: {transaction.orderType === 'dine_in' ? 'Dine In' : transaction.orderType === 'take_away' ? 'Take Away' : 'Delivery'}
                      {transaction.tableNumber ? ` · Meja ${transaction.tableNumber}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Pelanggan:</span>
                    <span>{transaction.customerName}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="py-2.5 border-b border-dashed border-gray-400 space-y-2">
                  {transaction.items.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold">
                        <span className="truncate pr-1">
                          {item.name} x{item.qty}
                        </span>
                        <span>Rp {item.totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                      {item.variant && (
                        <div className="text-[9px] text-gray-600 pl-2">
                          {[
                            item.variant.ice,
                            item.variant.sugar,
                            item.variant.milk,
                            item.variant.extraShot ? 'Extra Shot' : null,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </div>
                      )}
                      {item.note && (
                        <div className="text-[9px] text-gray-500 italic pl-2">
                          Note: "{item.note}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Summary Totals */}
                <div className="py-2 border-b border-dashed border-gray-400 space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {transaction.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  {transaction.promoDiscount > 0 && (
                    <div className="flex justify-between text-red-700">
                      <span>Promo ({transaction.promoCode || 'Diskon'})</span>
                      <span>- Rp {transaction.promoDiscount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {transaction.pointsDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Tukar Poin ({transaction.pointsUsed} pts)</span>
                      <span>- Rp {transaction.pointsDiscount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-xs pt-1 border-t border-gray-300">
                    <span>TOTAL AKHIR</span>
                    <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="py-2 border-b border-dashed border-gray-400 text-[10px] space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span>Pembayaran</span>
                    <span className="uppercase">{transaction.paymentMethod}</span>
                  </div>
                  {transaction.paymentMethod === 'cash' && (
                    <>
                      <div className="flex justify-between">
                        <span>Uang Diterima</span>
                        <span>Rp {(transaction.cashGiven || transaction.total).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>Kembalian</span>
                        <span>Rp {(transaction.changeGiven || 0).toLocaleString('id-ID')}</span>
                      </div>
                    </>
                  )}
                  {transaction.paymentMethod === 'qris' && (
                    <div className="flex justify-between text-[9px] text-gray-600">
                      <span>Ref QRIS</span>
                      <span>{transaction.qrisRef}</span>
                    </div>
                  )}
                  {transaction.pointsEarned > 0 && (
                    <div className="flex justify-between font-semibold text-emerald-700 pt-1">
                      <span>Poin Diperoleh</span>
                      <span>+{transaction.pointsEarned} Poin</span>
                    </div>
                  )}
                </div>

                {/* Dynamic QR Code for Digital Copy & Customer Feedback */}
                <div className="pt-3 pb-2 text-center border-t border-dashed border-gray-400 space-y-1.5">
                  <div className="font-bold text-[9px] uppercase tracking-wider text-black">
                    [ SCAN STRUK DIGITAL & ULASAN ]
                  </div>

                  {qrCodeUrl ? (
                    <div className="flex justify-center my-1">
                      <img
                        src={qrCodeUrl}
                        alt={`QR Code ${transaction.invoiceNo}`}
                        className="w-24 h-24 object-contain mx-auto border border-gray-200 p-1 bg-white cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ imageRendering: 'pixelated' }}
                        onClick={() => setShowDigitalModal(true)}
                        title="Klik untuk pratinjau struk digital & form ulasan"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto bg-gray-100 flex items-center justify-center text-[9px] text-gray-400">
                      Generating QR…
                    </div>
                  )}

                  <div className="text-[8.5px] font-semibold text-gray-800">
                    Beri Ulasan Rasa & Raih <b>+10 Poin</b> Member
                  </div>
                  <div className="text-[8px] font-mono text-gray-500">
                    ondeway.co.id/r/{transaction.invoiceNo}
                  </div>
                </div>

                {/* Footer notes */}
                <div className="pt-1 text-center space-y-1 border-t border-dashed border-gray-300">
                  <div className="text-[9px] text-gray-600">
                    Terima kasih telah menikmati sajian kopi Ondeway!
                  </div>
                  <div className="text-[8px] text-gray-400">
                    Instagram: @ondewaycoffee · Wi-Fi: ondeway-guest
                  </div>
                </div>
              </div>
            ) : (
              /* KITCHEN / BARISTA TICKET */
              <div>
                <div className="text-center pb-2 border-b-2 border-black space-y-0.5">
                  <div className="font-black text-sm tracking-widest">
                    TIKET BARISTA / KITCHEN
                  </div>
                  <div className="font-extrabold text-xs">
                    {transaction.orderType === 'dine_in'
                      ? `[ DINE IN ] - MEJA #${transaction.tableNumber || '01'}`
                      : transaction.orderType === 'take_away'
                      ? '[ TAKE AWAY ]'
                      : '[ DELIVERY ]'}
                  </div>
                  <div className="text-[10px]">
                    No: {transaction.invoiceNo} · Jam: {transaction.date.split(' ')[1]}
                  </div>
                </div>

                <div className="py-3 space-y-3">
                  {transaction.items.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-300 pb-2">
                      <div className="flex justify-between text-xs font-black">
                        <span>{item.name}</span>
                        <span className="text-sm px-1.5 bg-gray-200 rounded">x{item.qty}</span>
                      </div>
                      {item.variant && (
                        <div className="font-bold text-[10px] text-gray-800 mt-0.5 bg-yellow-100 p-1 rounded">
                          {[
                            item.variant.ice,
                            item.variant.sugar,
                            item.variant.milk,
                            item.variant.extraShot ? 'EXTRA SHOT ESPRESSO' : null,
                          ]
                            .filter(Boolean)
                            .join(' // ')}
                        </div>
                      )}
                      {item.note && (
                        <div className="text-[10px] font-bold text-red-700 italic mt-0.5">
                          NOTE: {item.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center text-[10px] font-bold border-t border-black">
                  Harap periksa kualitas sebelum disajikan.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fdf8f0] dark:bg-[#201712] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 text-xs font-semibold text-[#4a3227] dark:text-[#edd6b4] hover:bg-[#2a1a15]/5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDigitalModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#c1352d]/30 bg-[#c1352d]/10 hover:bg-[#c1352d]/20 text-[#c1352d] text-xs font-bold transition-all"
            title="Lihat struk digital & form ulasan"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Struk Digital</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#c1352d] text-white text-xs font-bold hover:bg-[#a92b24] shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk Thermal</span>
          </button>
        </div>

        {/* Digital Receipt & Feedback Form Modal */}
        {showDigitalModal && (
          <DigitalReceiptModal
            transaction={transaction}
            isOpen={showDigitalModal}
            onClose={() => setShowDigitalModal(false)}
          />
        )}
      </div>
    </div>
  );
};
