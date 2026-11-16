import React from 'react';

export default function CyberCassette() {
  return (
    <div className="relative w-full max-w-[260px] aspect-[4/5] bg-black border border-white/20 p-3 select-none flex flex-col justify-between overflow-hidden shadow-2xl group">
      {/* Subtle scanline texture overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.7)_51%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>
      
      {/* Top cassette header */}
      <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-zinc-400 border-b border-white/10 pb-1.5 z-10">
        <span className="font-bold text-white">SAUMX C90</span>
        <span className="px-1 py-0.5 bg-white text-black font-semibold text-[8px]">SX-II</span>
        <span>HIGH BIAS 70µs</span>
      </div>

      {/* Cassette Body Illustration */}
      <div className="relative my-auto w-full aspect-[16/10] bg-zinc-950 border border-white/20 rounded-sm p-2 flex flex-col justify-between z-10 shadow-inner">
        {/* Screw holes */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full border border-white/40 flex items-center justify-center">
          <div className="w-1 h-[0.5px] bg-white/60"></div>
        </div>
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full border border-white/40 flex items-center justify-center">
          <div className="w-1 h-[0.5px] bg-white/60"></div>
        </div>
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full border border-white/40 flex items-center justify-center">
          <div className="w-1 h-[0.5px] bg-white/60"></div>
        </div>
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full border border-white/40 flex items-center justify-center">
          <div className="w-1 h-[0.5px] bg-white/60"></div>
        </div>

        {/* Vintage Label area */}
        <div className="w-full bg-zinc-900 border border-white/10 px-2 py-1 flex items-center justify-between text-[9px] font-mono">
          <span className="text-white font-bold tracking-wider">CRYPT-VAULT</span>
          <span className="text-zinc-500 text-[8px]">SIDE A // AES-256</span>
        </div>

        {/* Tape Window with Spools */}
        <div className="relative w-4/5 mx-auto h-12 bg-black border border-white/20 rounded-sm flex items-center justify-around px-2 my-1">
          {/* Left Spool */}
          <div className="relative w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
            {/* Gear teeth */}
            <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            </div>
            <div className="absolute w-6 h-6 rounded-full border border-dashed border-white/30 animate-[spin_10s_linear_infinite]"></div>
          </div>

          {/* Center ruler markings */}
          <div className="flex flex-col items-center justify-center gap-0.5 text-[7px] font-mono text-zinc-600">
            <span className="text-white font-semibold">100 50 0</span>
            <div className="w-8 h-[1px] bg-zinc-700"></div>
            <span className="text-[6px] tracking-tight">INDEX</span>
          </div>

          {/* Right Spool */}
          <div className="relative w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            </div>
            <div className="absolute w-6 h-6 rounded-full border border-dashed border-white/30 animate-[spin_12s_linear_infinite]"></div>
          </div>
        </div>

        {/* Bottom Trapezoid Tape Head Guard */}
        <div className="w-3/5 mx-auto h-2.5 border-t border-x border-white/20 flex items-center justify-around px-1">
          <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
          <div className="w-1.5 h-1 bg-zinc-700"></div>
          <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
        </div>
      </div>

      {/* Bottom technical stamping */}
      <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 pt-1.5 border-t border-white/10 z-10">
        <span>PBKDF2-KEYGEN</span>
        <span>NO TELEMETRY</span>
        <span className="text-white font-bold">TYPE II</span>
      </div>
    </div>
  );
}

export function CassetteSchematic() {
  return (
    <div className="hidden lg:block w-36 h-full border-l border-white/10 pl-6 py-2 select-none opacity-60">
      <svg 
        viewBox="0 0 100 160" 
        className="w-full h-full stroke-white/40 fill-none"
        strokeWidth="0.75"
      >
        {/* Cassette chassis wireframe */}
        <rect x="5" y="10" width="90" height="140" rx="3" />
        <rect x="15" y="25" width="70" height="110" rx="2" strokeDasharray="2 2" />
        
        {/* Screw points */}
        <circle cx="10" cy="15" r="2" />
        <circle cx="90" cy="15" r="2" />
        <circle cx="10" cy="145" r="2" />
        <circle cx="90" cy="145" r="2" />
        <circle cx="50" cy="15" r="1.5" />

        {/* Reels */}
        <circle cx="50" cy="55" r="14" />
        <circle cx="50" cy="55" r="6" />
        <circle cx="50" cy="105" r="14" />
        <circle cx="50" cy="105" r="6" />

        {/* Window */}
        <rect x="35" y="40" width="30" height="80" rx="2" />
        <line x1="35" y1="80" x2="65" y2="80" strokeDasharray="1 1" />

        {/* Mechanical alignment lines */}
        <line x1="5" y1="40" x2="95" y2="40" strokeWidth="0.5" strokeDasharray="4 2" />
        <line x1="5" y1="120" x2="95" y2="120" strokeWidth="0.5" strokeDasharray="4 2" />
        
        {/* Technical text */}
        <text x="12" y="70" fontSize="5" fill="#888" fontFamily="monospace" transform="rotate(-90 12,70)">SCHEMATIC-V2</text>
        <text x="92" y="95" fontSize="5" fill="#888" fontFamily="monospace" transform="rotate(90 92,95)">1:1 SCALE</text>
      </svg>
    </div>
  );
}
