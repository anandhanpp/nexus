import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  useEffect(() => {
    // Ensure dark class is active for true black ex8.tech aesthetic
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black relative font-sans">
      {/* Subtle hairline technical grid background */}
      <div className="absolute inset-0 bg-grid opacity-35 pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
