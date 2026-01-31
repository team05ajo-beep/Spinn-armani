
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wheel } from './components/Wheel';
import { PrizeModal } from './components/PrizeModal';
import { PRIZES } from './constants';
import { AppStatus, Prize } from './types';
import { getFortuneMessage } from './services/geminiService';

const App: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const [fortune, setFortune] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  
  const currentRotation = useRef(0);

  useEffect(() => {
    const savedSpinState = localStorage.getItem('armani_spin_v2');
    if (savedSpinState === 'true') setHasSpun(true);
  }, []);

  const handleSpin = useCallback(async () => {
    if (status === AppStatus.SPINNING || hasSpun) return;

    setStatus(AppStatus.SPINNING);
    
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];
    
    const segmentAngle = 360 / PRIZES.length;
    // Align center of prize with pointer at the top (0 deg)
    const stopAt = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
    
    const extraSpins = 10; 
    const totalNewRotation = currentRotation.current + (extraSpins * 360) + stopAt;
    
    setRotation(totalNewRotation);
    currentRotation.current = totalNewRotation;

    // Prefetch fortune message
    const fortunePromise = getFortuneMessage(prize.label);

    setTimeout(async () => {
      const fetchedFortune = await fortunePromise;
      setWinningPrize(prize);
      setFortune(fetchedFortune);
      setStatus(AppStatus.WINNER);
      setHasSpun(true);
      localStorage.setItem('armani_spin_v2', 'true');
    }, 10500); // Wait for wheel animation to finish
  }, [status, hasSpun]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-between relative overflow-hidden animate-page-entry"
         style={{ 
           paddingTop: 'calc(2.5rem + env(safe-area-inset-top))',
           paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
           paddingLeft: '2rem',
           paddingRight: '2rem'
         }}>
      
      {/* Sophisticated Header */}
      <header className="w-full flex flex-col items-center z-10 shrink-0 space-y-4">
        <h1 className="font-bodoni text-3xl sm:text-5xl font-light tracking-[0.5em] text-[#e6e6e6] uppercase text-center gold-shine">
          GIORGIO ARMANI
        </h1>
        <div className="flex items-center gap-4">
          <div className="w-8 h-[0.5px] bg-[#c8a45d]/30"></div>
          <p className="text-[#888] tracking-[0.6em] font-montserrat text-[8px] sm:text-[10px] uppercase font-medium">
            Exclusive Client Experience
          </p>
          <div className="w-8 h-[0.5px] bg-[#c8a45d]/30"></div>
        </div>
      </header>

      {/* Wheel Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center z-10 relative">
        <div className={`w-full max-w-[450px] aspect-square transition-all duration-1000 ${status === AppStatus.WINNER ? 'opacity-0 scale-95 blur-xl pointer-events-none' : 'opacity-100 scale-100'}`}>
          <Wheel prizes={PRIZES} rotation={rotation} isSpinning={status === AppStatus.SPINNING} />
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="w-full flex flex-col items-center gap-8 z-10 shrink-0">
        <div className="relative w-full max-w-[280px]">
          <button
            onClick={handleSpin}
            disabled={status === AppStatus.SPINNING || hasSpun}
            className={`
              w-full py-4 rounded-none font-montserrat text-[10px] tracking-[0.6em] font-bold uppercase transition-all duration-700 border
              ${status === AppStatus.SPINNING || hasSpun
                ? 'bg-transparent text-[#444] border-[#222] cursor-not-allowed' 
                : 'bg-transparent text-[#c8a45d] border-[#c8a45d]/40 shadow-[0_0_30px_rgba(200,164,93,0.05)] hover:border-[#c8a45d] active:scale-95'}
            `}
          >
            {status === AppStatus.SPINNING ? 'PROCESSO...' : hasSpun ? 'SUDAH DIGUNAKAN' : 'MULAI PUTAR'}
          </button>
        </div>
        <p className="text-[#444] font-montserrat text-[7px] tracking-[1.2em] uppercase font-bold">MILANO</p>
      </footer>

      {status === AppStatus.WINNER && winningPrize && (
        <PrizeModal prize={winningPrize} fortune={fortune} onClose={() => setStatus(AppStatus.IDLE)} />
      )}
    </div>
  );
};

export default App;
