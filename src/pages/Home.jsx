import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Search, 
  Shield, 
  Globe, 
  Cpu, 
  Network, 
  KeyRound, 
  Binary, 
  Lock, 
  ShieldCheck, 
  Radio, 
  Activity, 
  AlertOctagon, 
  Fingerprint, 
  Globe2, 
  Flame, 
  Database,
  Layers
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import CrystalWireframe from '../components/home/CrystalWireframe';
import ModularPuzzleShape from '../components/home/ModularPuzzleShape';
import CyberCassette, { CassetteSchematic } from '../components/home/CyberCassette';
import StatsBar from '../components/home/StatsBar';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchInputRef = useRef(null);

  // Global hotkey: press '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getToolIcon = (iconName) => {
    const props = { className: "w-4 h-4 text-white shrink-0" };
    switch (iconName) {
      case 'Globe': return <Globe {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Search': return <Search {...props} />;
      case 'Network': return <Network {...props} />;
      case 'KeyRound': return <KeyRound {...props} />;
      case 'Binary': return <Binary {...props} />;
      case 'Lock': return <Lock {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Radio': return <Radio {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'AlertOctagon': return <AlertOctagon {...props} />;
      case 'Fingerprint': return <Fingerprint {...props} />;
      case 'Globe2': return <Globe2 {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Database': return <Database {...props} />;
      default: return <Shield {...props} />;
    }
  };

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-black text-white selection:bg-white selection:text-black">
      {/* 1. HERO SECTION: Replicating ex8.tech top hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Chunky Pixel Headline + Description + Button */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-[0.95] text-white">
              DEVELOPING<br />
              BETTER<br />
              SOFTWARE
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-lg font-sans leading-relaxed">
              We develop clear, user-friendly and optimized cybersecurity tools. 100% client-side execution running directly in your browser.
            </p>

            <div className="pt-2">
              <a
                href="#apps"
                className="inline-flex items-center gap-4 px-6 py-3 border border-white/40 text-xs font-mono tracking-widest uppercase hover:border-white hover:bg-white hover:text-black transition-all group"
              >
                <span>BROWSE APPS</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: 3D Isometric Crystal Wireframe Artwork */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <CrystalWireframe />
          </div>
        </div>
      </section>

      {/* 2. RECENTLY RELEASED FEATURED CARD: Replicating "KASSETA" from ex8.tech */}
      <section className="w-full border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch">
          {/* Rotated Vertical Label */}
          <div className="hidden md:flex items-center justify-center border-r border-white/10 px-4 py-8 select-none">
            <span className="writing-vertical text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase whitespace-nowrap">
              RECENTLY RELEASED
            </span>
          </div>

          {/* Card Content Grid */}
          <div className="flex-1 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Box: Analog Cyber Cassette */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <CyberCassette />
            </div>

            {/* Middle: Specifications & Launch Action */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 block">
                  MODULE // CRY-03
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-wider uppercase text-white mt-1">
                  CRYPTO VAULT
                </h3>
                <div className="w-8 h-[2px] bg-white my-2.5"></div>
              </div>

              {/* Specification table */}
              <div className="space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex items-start gap-2">
                  <span className="text-zinc-500">⬡</span>
                  <span><strong className="text-white">Platform:</strong> Linux, macOS, Windows (Browser Native)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-zinc-500">⊞</span>
                  <span><strong className="text-white">Type:</strong> Zero-Knowledge Client Vault</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-zinc-500">⚡</span>
                  <span><strong className="text-white">Format:</strong> AES-256-GCM, PBKDF2, WebCrypto</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-zinc-500">◎</span>
                  <span><strong className="text-white">Description:</strong> A client-side encrypted secrets manager with hardware-grade key derivation, inactivity auto-lock, and offline backup export.</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-6">
                <Link
                  to="/tools/crypto-vault"
                  className="px-6 py-2.5 bg-white text-black font-mono text-xs font-bold tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  <span>OPEN VAULT</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/tools/crypto-vault"
                  className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white underline underline-offset-4 decoration-white/30"
                >
                  DETAILED INFORMATION
                </Link>
              </div>
            </div>

            {/* Right: Technical Blueprint Schematic */}
            <div className="lg:col-span-2 hidden lg:flex items-center justify-end">
              <CassetteSchematic />
            </div>
          </div>
        </div>
      </section>

      {/* 3. "WHY AND HOW?" SECTION: Replicating ex8.tech modular metaball graphic */}
      <section className="w-full border-t border-white/10 bg-black py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Connected Circular Puzzle Metaball Shape */}
            <div className="md:col-span-5 flex items-center justify-center md:justify-start">
              <ModularPuzzleShape />
            </div>

            {/* Right: Editorial statement */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="font-sans text-lg sm:text-xl font-bold tracking-wider uppercase text-white">
                  WHY AND HOW?
                </h3>
                <div className="w-8 h-[2px] bg-white my-2"></div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed max-w-xl">
                We're passionate about creating user-friendly security apps that bring uncompromising zero-knowledge privacy or simply make client-side network diagnostics transparent and instant.
              </p>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all"
                >
                  <span>Read about our tech stack</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATS BAR: 4 Columns with chunky pixel numbers */}
      <StatsBar />

      {/* 5. TOOL CATALOG & DIRECTORY: All 8 Tools + Roadmap cards */}
      <section id="apps" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-8">
        {/* Section Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-500 block">
              CATALOG // 8 READY • 6 COMING SOON
            </span>
            <h2 className="font-pixel text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white">
              ALL APPLICATIONS
            </h2>
          </div>

          {/* Search bar with / hotkey */}
          <div className="relative w-full md:w-80">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a tool or algorithm..."
              className="w-full bg-black border border-white/20 px-3.5 py-2 pl-9 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 border border-white/10">
              /
            </kbd>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-semibold'
                  : 'bg-black text-zinc-400 border border-white/20 hover:border-white hover:text-white'
              }`}
            >
              [{cat.name}]
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isReady = tool.status === 'ready';

            return (
              <div
                key={tool.id}
                className={`p-6 border flex flex-col justify-between transition-all group ${
                  isReady 
                    ? 'bg-black border-white/15 hover:border-white/50' 
                    : 'bg-black/50 border-white/10 border-dashed opacity-75'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header: Code & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-lg text-white font-bold tracking-wider">
                      {tool.code}
                    </span>
                    <div className="p-2 border border-white/20 bg-zinc-950">
                      {getToolIcon(tool.icon)}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-sans text-base font-bold uppercase tracking-wider text-white">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                      {tool.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Metadata & Button */}
                <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    {tool.badge}
                  </span>

                  {isReady ? (
                    <Link
                      to={tool.path}
                      className="px-3.5 py-1.5 bg-white text-black font-mono text-xs font-semibold tracking-wider flex items-center gap-1.5 hover:bg-zinc-200 transition-colors"
                    >
                      <span>OPEN</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="px-2.5 py-1 border border-white/20 text-[10px] font-mono text-zinc-500 uppercase">
                      COMING SOON
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
