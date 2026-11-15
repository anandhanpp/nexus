import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  ArrowRight, 
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
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getToolIcon = (iconName) => {
    const props = { className: "w-6 h-6 text-cyan-600 dark:text-cyan-400" };
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
                          tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* 1. Hero Section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Every tool runs in under 10 seconds • Zero tracking</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          Cybersecurity tools for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">everyone</span>.
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
          Clean, fast, client-side diagnostics for beginners, IT staff, and security teams. Plain-English verdicts by default, deep technical insights on demand.
        </p>

        {/* 2. Search & Category Filters */}
        <div className="max-w-xl mx-auto pt-4 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a tool (e.g. password, IP, DNS, subnet, hash)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 shadow-lg shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-cyan-500 text-base transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Tools ({TOOLS.length})
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Grid of Tool Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {CATEGORIES.map(cat => {
          const catTools = filteredTools.filter(t => t.category === cat.id);
          if (catTools.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{cat.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-900 text-slate-500 font-mono">
                    {catTools.length}
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {catTools.map(tool => {
                  const isReady = tool.status === 'ready';

                  return (
                    <div
                      key={tool.id}
                      className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between p-6 ${
                        isReady
                          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 hover:border-cyan-500/50 hover:shadow-xl dark:hover:shadow-cyan-950/40 group'
                          : 'border-slate-200/60 dark:border-slate-800/50 bg-slate-50/60 dark:bg-navy-950/40 opacity-75'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center">
                            {getToolIcon(tool.icon)}
                          </div>
                          {!isReady && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                              Coming Soon
                            </span>
                          )}
                          {isReady && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ready</span>
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {tool.shortDesc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6">
                        {isReady ? (
                          <Link
                            to={tool.path}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-600 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all"
                          >
                            <span>Open Tool</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-xs font-semibold cursor-not-allowed"
                          >
                            In Development
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredTools.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Search className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No tools found</h3>
            <p className="text-sm text-slate-500">
              No toolkit match found for "{searchQuery}". Try searching for IP, password, hash, or DNS.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
