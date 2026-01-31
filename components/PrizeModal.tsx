
import React, { useEffect, useState, useRef } from 'react';
import { Prize } from '../types';
import html2canvas from 'html2canvas';

interface PrizeModalProps {
  prize: Prize;
  fortune: string | null;
  onClose: () => void;
}

export const PrizeModal: React.FC<PrizeModalProps> = ({ prize, fortune, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsRendered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const downloadVoucherPNG = async () => {
    if (!exportRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      if (document.fonts) await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#050505',
        scale: 3, 
        useCORS: true,
        width: 960,
        height: 640,
      });
      
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Armani-Voucher-${prize.label}.png`;
      link.click();
      setIsDownloading(false);
    } catch (err) {
      console.error("Export Error:", err);
      setIsDownloading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-2xl transition-all duration-1000 ${isRendered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
      
      {/* Offscreen export card */}
      <div className="fixed opacity-0 pointer-events-none z-[-1]">
        <div ref={exportRef} style={{ width: '960px', height: '640px', background: '#050505' }} className="relative flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#050505]"></div>
          <div className="absolute inset-10 border border-[#c8a45d]/30"></div>
          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            <span className="text-[#c8a45d] font-montserrat text-[14px] tracking-[1.2em] uppercase">Private Invitation</span>
            <div className="space-y-2">
              <h2 className="font-bodoni italic font-bold text-[#f2e1c1] text-[160px] leading-none tracking-tighter">{prize.label}</h2>
              <p className="text-[#c8a45d] font-montserrat text-[20px] tracking-[1.5em] uppercase">Voucher</p>
            </div>
            <div className="w-24 h-[1px] bg-[#c8a45d]/40"></div>
            <p className="text-[#e6e6e6]/60 font-montserrat text-[12px] tracking-[0.5em] uppercase">Exclusive Reward for Giorgio Armani Clients</p>
          </div>
        </div>
      </div>

      {/* Onscreen Preview */}
      <div className="w-full max-w-[440px] flex flex-col items-center space-y-8 animate-page-entry">
        <div className="w-full aspect-[1.5/1] bg-[#111] border border-[#c8a45d]/20 relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
           <div className="absolute inset-0 bg-radial-gradient(circle, transparent 30%, rgba(0,0,0,0.9) 100%)"></div>
           <div className="absolute inset-4 border border-[#c8a45d]/10"></div>
           <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-4">
              <span className="text-[#c8a45d]/40 font-montserrat text-[8px] tracking-[0.8em] uppercase">Congratulation</span>
              <h3 className="font-bodoni italic text-[#f2e1c1] text-7xl sm:text-8xl">{prize.label}</h3>
              <p className="text-[#c8a45d]/60 font-montserrat text-[10px] tracking-[1em] uppercase">Voucher</p>
           </div>
        </div>

        <div className="text-center space-y-4 px-4">
          <p className="text-[#B8B8B8] font-garamond italic text-lg leading-relaxed opacity-80">
            "{fortune || `Sebuah persembahan eksklusif untuk Anda. Nikmati kemewahan Giorgio Armani dengan voucher senilai ${prize.label}.`}"
          </p>
        </div>

        <div className="w-full flex flex-col gap-4 px-6">
          <button
            onClick={downloadVoucherPNG}
            disabled={isDownloading}
            className="w-full py-4 bg-[#c8a45d] text-black font-montserrat text-[11px] tracking-[0.5em] font-bold uppercase transition-all hover:brightness-110 active:scale-95 shadow-xl disabled:opacity-50"
          >
            {isDownloading ? 'MENYIAPKAN...' : 'UNDUH VOUCHER'}
          </button>
          <button onClick={onClose} className="text-[#666] font-montserrat text-[9px] tracking-[0.4em] uppercase hover:text-white transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
