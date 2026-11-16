import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black text-zinc-400 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono">
          {/* Left: Navigation Links with subtle hover underlines */}
          <div className="flex flex-wrap items-center gap-6 tracking-widest uppercase">
            <Link to="/" className="text-zinc-300 hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all">
              Our Apps
            </Link>
            <Link to="/about" className="text-zinc-300 hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all">
              About
            </Link>
            <Link to="/privacy" className="text-zinc-300 hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all">
              Contacts
            </Link>
          </div>

          {/* Center: Brand / Copyright & Email */}
          <div className="text-center text-zinc-500 tracking-wider text-[11px]">
            <span>© EX8 SOFTWARE. WRITE US: </span>
            <a 
              href="mailto:audit@ex8.tech" 
              className="text-zinc-400 hover:text-white underline underline-offset-2 decoration-white/30 hover:decoration-white transition-colors"
            >
              AUDIT@EX8.TECH
            </a>
          </div>

          {/* Right: Terms & Privacy */}
          <div className="flex items-center gap-6 tracking-widest uppercase text-[11px]">
            <Link to="/about" className="text-zinc-400 hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link to="/privacy" className="text-zinc-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
