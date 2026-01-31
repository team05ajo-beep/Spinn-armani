
import React, { useMemo } from 'react';
import { Prize } from '../types';

interface WheelProps {
  prizes: Prize[];
  rotation: number;
  isSpinning: boolean;
}

export const Wheel: React.FC<WheelProps> = ({ prizes, rotation, isSpinning }) => {
  const size = 600;
  const center = size / 2;
  const radius = center - 85; 
  const segmentAngle = 360 / prizes.length;

  const segments = useMemo(() => {
    return prizes.map((prize, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      
      const x1 = center + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = center + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = center + radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = center + radius * Math.sin((Math.PI * (endAngle - 90)) / 180);

      const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
      const isTopPrize = prize.label === '1000K';
      
      const fill = isTopPrize 
        ? "url(#midnightLuxuryGold)" 
        : (index % 2 === 0 ? "url(#carbonDark)" : "url(#carbonDeep)");

      return (
        <g key={prize.id}>
          <path
            d={path}
            fill={fill}
            stroke="rgba(200,164,93,0.15)"
            strokeWidth="0.5"
          />
          <g transform={`rotate(${startAngle + segmentAngle / 2}, ${center}, ${center})`}>
            <text
              x={center}
              y={center - radius * 0.72}
              fill="#f3e29f"
              className="font-bodoni font-bold italic"
              textAnchor="middle"
              style={{ 
                fontSize: '34px',
                filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.8))',
                letterSpacing: '-1px'
              }}
            >
              {prize.label}
            </text>
          </g>
        </g>
      );
    });
  }, [prizes, radius, center, segmentAngle]);

  const markers = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => {
      const angle = (i * 360) / 36;
      const r = radius + 30;
      const x = center + r * Math.cos((Math.PI * angle) / 180);
      const y = center + r * Math.sin((Math.PI * angle) / 180);
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 === 0 ? 3 : 1.5}
          fill={i % 3 === 0 ? "#f3e29f" : "#4a360a"}
          style={{ filter: i % 3 === 0 ? 'drop-shadow(0px 0px 5px rgba(243,226,159,0.8))' : 'none' }}
        />
      );
    });
  }, [radius, center]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Pointer - Top centered */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[20%] z-50">
        <svg width="60" height="80" viewBox="0 0 60 80" className="filter drop-shadow(0 10px 15px rgba(0,0,0,0.7))">
          <path d="M30 80 L5 20 A 25 25 0 1 1 55 20 Z" fill="url(#goldBezel3D)" stroke="#1a1a1a" strokeWidth="1"/>
          <circle cx="30" cy="20" r="8" fill="#000" />
        </svg>
      </div>

      <div className="relative w-full h-full p-4">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full relative z-20"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 10s cubic-bezier(0.12, 0, 0.05, 1)' : 'none',
          }}
        >
          <defs>
            <linearGradient id="goldBezel3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8a6d3b" />
              <stop offset="25%" stopColor="#f3e29f" />
              <stop offset="50%" stopColor="#fff" />
              <stop offset="75%" stopColor="#f3e29f" />
              <stop offset="100%" stopColor="#4a360a" />
            </linearGradient>

            <linearGradient id="carbonDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>

            <linearGradient id="carbonDeep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#121212" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>

            <linearGradient id="midnightLuxuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a1f0a" />
              <stop offset="50%" stopColor="#4a3d1c" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
          </defs>

          {/* Outer Ring */}
          <circle cx={center} cy={center} r={radius + 50} fill="url(#goldBezel3D)" />
          <circle cx={center} cy={center} r={radius + 44} fill="#0a0a0a" />
          
          {/* Main Wheel Body */}
          <circle cx={center} cy={center} r={radius} fill="#000" />
          
          {segments}
          {markers}

          {/* Center Hub */}
          <circle cx={center} cy={center} r="65" fill="url(#goldBezel3D)" />
          <circle cx={center} cy={center} r="60" fill="#050505" />
          
          <text
            x={center}
            y={center + 5}
            fill="#f3e29f"
            className="font-montserrat font-bold tracking-[0.5em]"
            textAnchor="middle"
            style={{ fontSize: '12px', textTransform: 'uppercase' }}
          >
            ARMANI
          </text>
        </svg>

        {/* Ambient Glow behind the wheel */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_150px_rgba(200,164,93,0.1)] pointer-events-none z-10"></div>
      </div>
    </div>
  );
};
