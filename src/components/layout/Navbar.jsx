import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Shield, Terminal, ArrowRight } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../../data/toolsData';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo: Chunky Pixel font matching ex8.tech screenshot */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-pixel text-3xl sm:text-4xl font-bold tracking-widest text-white group-hover:text-zinc-300 transition-colors">
            EX8
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase border-l border-white/20 pl-3">
            NEXUS CYBER TOOLKIT
          </span>
        </Link>

        {/* Desktop Quick Links & Menu trigger */}
        <div className="flex items-center gap-6 sm:gap-8">
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-zinc-400">
            <Link 
              to="/" 
              className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-white border-b border-white pb-0.5' : ''}`}
            >
              Browse Apps
            </Link>
            <Link 
              to="/about" 
              className={`hover:text-white transition-colors ${location.pathname === '/about' ? 'text-white border-b border-white pb-0.5' : ''}`}
            >
              Architecture
            </Link>
            <Link 
              to="/privacy" 
              className={`hover:text-white transition-colors ${location.pathname === '/privacy' ? 'text-white border-b border-white pb-0.5' : ''}`}
            >
              Zero-Telemetry
            </Link>
          </nav>

          {/* MENU Button: exactly like ex8.tech top right */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-xs font-mono font-medium tracking-widest uppercase text-white hover:text-zinc-300 transition-colors py-1.5 px-3 border border-white/20 hover:border-white/60"
            aria-label="Toggle Navigation Menu"
          >
            <span>{menuOpen ? 'CLOSE' : 'MENU'}</span>
            {menuOpen ? (
              <X className="w-4 h-4 text-white" />
            ) : (
              <div className="flex flex-col gap-[3px] w-4 justify-center">
                <span className="w-full h-[1.5px] bg-white"></span>
                <span className="w-full h-[1.5px] bg-white"></span>
                <span className="w-full h-[1.5px] bg-white"></span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen / Drawer Menu overlay */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black/98 px-4 sm:px-8 py-8 animate-fadeIn max-h-[85vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-4">
              <span className="font-pixel text-2xl text-white block">EX8 // SYSTEM</span>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Autonomous, zero-knowledge browser security suite. All cryptographic algorithms run locally with zero cloud telemetry.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase bg-white text-black px-4 py-2 hover:bg-zinc-200 transition-colors"
                >
                  <span>Launch All Utilities</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Network utilities */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block border-b border-white/10 pb-1">
                [NET] Network Recon
              </span>
              <ul className="space-y-2 text-xs font-mono">
                {TOOLS.filter(t => t.category === 'network').map(tool => (
                  <li key={tool.id}>
                    <Link
                      to={tool.path}
                      onClick={() => setMenuOpen(false)}
                      className="text-zinc-300 hover:text-white flex items-center justify-between py-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {tool.code} // {tool.name}
                      </span>
                      {tool.status === 'coming-soon' ? (
                        <span className="text-[9px] text-zinc-600 uppercase">WIP</span>
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cryptography utilities */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block border-b border-white/10 pb-1">
                [CRY] Passwords & Crypto
              </span>
              <ul className="space-y-2 text-xs font-mono">
                {TOOLS.filter(t => t.category === 'passwords').map(tool => (
                  <li key={tool.id}>
                    <Link
                      to={tool.path}
                      onClick={() => setMenuOpen(false)}
                      className="text-zinc-300 hover:text-white flex items-center justify-between py-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {tool.code} // {tool.name}
                      </span>
                      {tool.status === 'coming-soon' ? (
                        <span className="text-[9px] text-zinc-600 uppercase">WIP</span>
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Integrity & Docs */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block border-b border-white/10 pb-1">
                [INT] System & Docs
              </span>
              <ul className="space-y-2 text-xs font-mono">
                {TOOLS.filter(t => t.category === 'integrity').map(tool => (
                  <li key={tool.id}>
                    <Link
                      to={tool.path}
                      onClick={() => setMenuOpen(false)}
                      className="text-zinc-300 hover:text-white flex items-center justify-between py-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {tool.code} // {tool.name}
                      </span>
                      {tool.status === 'coming-soon' ? (
                        <span className="text-[9px] text-zinc-600 uppercase">WIP</span>
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white" />
                      )}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 border-t border-white/10">
                  <Link
                    to="/about"
                    onClick={() => setMenuOpen(false)}
                    className="text-zinc-400 hover:text-white flex items-center justify-between py-1"
                  >
                    <span>System Specifications</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    onClick={() => setMenuOpen(false)}
                    className="text-zinc-400 hover:text-white flex items-center justify-between py-1"
                  >
                    <span>Egress Network Audit</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
