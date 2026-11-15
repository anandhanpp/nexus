import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('nexus_dark_mode');
    return saved !== null ? saved === 'true' : true; // Dark mode by default
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('nexus_dark_mode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('nexus_dark_mode', 'false');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors selection:bg-cyan-500 selection:text-white">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
