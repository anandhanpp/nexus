import React from 'react';

export default function CrystalWireframe() {
  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center select-none">
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full drop-shadow-[0_0_25px_rgba(255,255,255,0.08)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="crystalFacet1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#888888" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="crystalFacet2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="crystalFacet3" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="cubeGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Background particle constellation */}
        <g opacity="0.65">
          <circle cx="90" cy="70" r="1.5" fill="#fff" />
          <circle cx="110" cy="85" r="1" fill="#888" />
          <circle cx="140" cy="65" r="2" fill="#fff" />
          <circle cx="210" cy="50" r="1.5" fill="#fff" />
          <circle cx="235" cy="75" r="1" fill="#aaa" />
          <circle cx="250" cy="60" r="2.5" fill="#fff" />
          <circle cx="360" cy="110" r="1.5" fill="#fff" />
          <circle cx="375" cy="130" r="1" fill="#888" />
          <circle cx="350" cy="145" r="2" fill="#fff" />
          <circle cx="330" cy="170" r="1.5" fill="#aaa" />
          <circle cx="310" cy="200" r="1" fill="#fff" />
          <circle cx="295" cy="225" r="2" fill="#fff" />
          <circle cx="340" cy="250" r="1.5" fill="#aaa" />
          <circle cx="320" cy="280" r="1" fill="#fff" />
          <circle cx="300" cy="310" r="2.5" fill="#fff" />
          <circle cx="260" cy="330" r="1.5" fill="#888" />
          <circle cx="230" cy="345" r="2" fill="#fff" />
          <circle cx="200" cy="355" r="1.5" fill="#aaa" />
        </g>

        {/* Small floating wireframe cube (Top Left) */}
        <g transform="translate(195, 60) scale(0.4)" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round">
          {/* Top Face */}
          <polygon points="50,10 90,30 50,50 10,30" fill="url(#cubeGlow)" />
          {/* Left Face */}
          <polygon points="10,30 50,50 50,90 10,70" fill="rgba(255,255,255,0.04)" />
          {/* Right Face */}
          <polygon points="50,50 90,30 90,70 50,90" fill="rgba(255,255,255,0.08)" />
          <line x1="50" y1="50" x2="50" y2="90" stroke="#fff" strokeWidth="1.5" />
        </g>

        {/* 1. Large 3D Faceted Crystal Polyhedron (Top Right) */}
        <g transform="translate(245, 45) scale(1.15)">
          {/* Outer crystal facets */}
          {/* Center apex */}
          {/* Main top triangle */}
          <polygon 
            points="55,0 95,30 65,55" 
            fill="url(#crystalFacet1)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          <polygon 
            points="55,0 65,55 20,40" 
            fill="url(#crystalFacet2)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          <polygon 
            points="55,0 20,40 10,18" 
            fill="url(#crystalFacet3)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          
          {/* Upper right facet */}
          <polygon 
            points="95,30 110,65 65,55" 
            fill="url(#crystalFacet3)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          
          {/* Center facets */}
          <polygon 
            points="65,55 110,65 85,100" 
            fill="url(#crystalFacet1)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          <polygon 
            points="20,40 65,55 45,95" 
            fill="url(#crystalFacet2)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          <polygon 
            points="65,55 85,100 45,95" 
            fill="url(#crystalFacet3)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />

          {/* Lower facets */}
          <polygon 
            points="45,95 85,100 58,118" 
            fill="url(#crystalFacet1)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          <polygon 
            points="20,40 45,95 10,75" 
            fill="url(#crystalFacet2)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          <polygon 
            points="10,75 45,95 58,118" 
            fill="url(#crystalFacet3)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          <polygon 
            points="85,100 110,65 105,92" 
            fill="url(#crystalFacet2)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />
          <polygon 
            points="85,100 105,92 58,118" 
            fill="url(#crystalFacet1)" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
          />

          {/* Internal refraction lines */}
          <line x1="55" y1="0" x2="85" y2="100" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.7" />
          <line x1="20" y1="40" x2="110" y2="65" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="65" y1="55" x2="58" y2="118" stroke="#ffffff" strokeWidth="0.6" opacity="0.9" />
        </g>

        {/* 2. Middle Wireframe Cube (Upper Left) */}
        <g transform="translate(170, 160) scale(0.9)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round">
          {/* Isometric Cube */}
          {/* Top Face */}
          <polygon points="50,10 90,30 50,50 10,30" fill="rgba(255,255,255,0.06)" />
          {/* Left Face */}
          <polygon points="10,30 50,50 50,90 10,70" fill="rgba(255,255,255,0.02)" />
          {/* Right Face */}
          <polygon points="50,50 90,30 90,70 50,90" fill="rgba(255,255,255,0.05)" />
          {/* Center edge */}
          <line x1="50" y1="50" x2="50" y2="90" stroke="#ffffff" strokeWidth="1.5" />
          {/* Inner back edges (dashed) */}
          <line x1="10" y1="30" x2="50" y2="10" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5" />
          <line x1="90" y1="30" x2="50" y2="10" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5" />
        </g>

        {/* 3. Small Solid Accent Cube inside wireframe */}
        <g transform="translate(202, 255) scale(0.4)" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="50,10 90,30 50,50 10,30" fill="#ffffff" />
          <polygon points="10,30 50,50 50,90 10,70" fill="#cccccc" />
          <polygon points="50,50 90,30 90,70 50,90" fill="#999999" />
        </g>

        {/* 4. Lower Wireframe Cube (Bottom Center) */}
        <g transform="translate(180, 245) scale(1.0)" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round">
          {/* Top Face */}
          <polygon points="50,10 90,30 50,50 10,30" fill="rgba(255,255,255,0.04)" />
          {/* Left Face */}
          <polygon points="10,30 50,50 50,90 10,70" fill="rgba(255,255,255,0.02)" />
          {/* Right Face */}
          <polygon points="50,50 90,30 90,70 50,90" fill="rgba(255,255,255,0.05)" />
          <line x1="50" y1="50" x2="50" y2="90" stroke="#ffffff" strokeWidth="1.5" />
        </g>

        {/* Subtle grid base perspective line */}
        <path d="M120 370 L280 370" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
      </svg>
    </div>
  );
}
