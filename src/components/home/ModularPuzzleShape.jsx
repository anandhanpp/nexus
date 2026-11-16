import React from 'react';

export default function ModularPuzzleShape() {
  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[2/1] select-none flex items-center justify-center">
      <svg 
        viewBox="0 0 320 160" 
        className="w-full h-auto"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Modular Connected Shape: Replicating the iconic ex8.tech geometric metaball block */}
        <g fill="#ffffff">
          {/* Node 1: Top Left */}
          <circle cx="50" cy="50" r="28" />
          {/* Node 2: Bottom Left */}
          <circle cx="50" cy="110" r="28" />
          {/* Bridge between Node 1 & 2 */}
          <rect x="22" y="50" width="56" height="60" />

          {/* Node 3: Top Middle-Left */}
          <circle cx="110" cy="50" r="28" />
          {/* Node 4: Bottom Middle-Left */}
          <circle cx="110" cy="110" r="28" />

          {/* Connected horizontal bridge */}
          <rect x="50" y="82" width="60" height="56" />

          {/* Node 5: Top Middle-Right */}
          <circle cx="180" cy="50" r="28" />
          {/* Node 6: Bottom Middle-Right */}
          <circle cx="180" cy="110" r="28" />
          {/* Bridge */}
          <rect x="152" y="50" width="56" height="60" />

          {/* Node 7: Top Right */}
          <circle cx="250" cy="50" r="28" />
          {/* Node 8: Bottom Right */}
          <circle cx="250" cy="110" r="28" />
          
          {/* Diagonal / horizontal bridge between col 2 & 3 */}
          <path d="M110 50 Q145 50 145 80 Q145 110 180 110 L180 138 Q125 138 110 110 Z" fill="#ffffff" />
          <path d="M180 50 Q215 50 215 80 Q215 110 250 110 L250 82 Q230 82 215 50 Z" fill="#ffffff" />
        </g>

        {/* Crisp negative-space cutouts */}
        <g fill="#000000">
          <circle cx="50" cy="80" r="14" />
          <circle cx="110" cy="50" r="12" />
          <circle cx="180" cy="110" r="12" />
          <circle cx="215" cy="80" r="14" />
          {/* Subtle checkered quarter cut */}
          <rect x="78" y="50" width="28" height="28" rx="4" />
        </g>
      </svg>
    </div>
  );
}
