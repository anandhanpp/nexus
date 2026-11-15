import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronDown, 
  Network, 
  Key, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../../data/toolsData';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close category dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Network': return <Network className="w-4 h-4 text-cyan-400" />;
      case 'Key': return <Key className="w-4 h-4 text-cyan-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      default: return <Shield className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-navy-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-cyan-500/20" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
                NEXUS<span className="text-cyan-600 dark:text-cyan-400 ml-1">HUB</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-semibold">
                Cybersecurity Toolkit
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400'
              }`}
            >
              All Tools
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                aria-expanded={categoryDropdownOpen}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 focus:outline-none transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-fadeIn">
                  {CATEGORIES.map(cat => {
                    const categoryTools = TOOLS.filter(t => t.category === cat.id && t.status === 'ready');
                    return (
                      <div key={cat.id} className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 last:border-b-0">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1 px-2">
                          {getCategoryIcon(cat.icon)}
                          <span>{cat.name}</span>
                        </div>
                        <div className="space-y-0.5">
                          {categoryTools.map(t => (
                            <Link
                              key={t.id}
                              to={t.path}
                              className="block px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                            >
                              {t.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/about' 
                  ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400'
              }`}
            >
              About
            </Link>

            <Link
              to="/privacy"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/privacy' 
                  ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400'
              }`}
            >
              Privacy
            </Link>
          </div>

          {/* Right side: Dark/Light Mode toggle & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-3 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-slate-800 animate-fadeIn">
          <Link
            to="/"
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-navy-900"
          >
            All Tools
          </Link>
          <div className="pl-3 space-y-1">
            <span className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500">Categories</span>
            {TOOLS.filter(t => t.status === 'ready').map(t => (
              <Link
                key={t.id}
                to={t.path}
                className="block py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-500"
              >
                {t.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-2 space-y-1">
            <Link
              to="/about"
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
            >
              Privacy & Zero-Knowledge Notice
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
