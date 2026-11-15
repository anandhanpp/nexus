import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Lock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Compliance / Authorization Warning Banner */}
        <div className="rounded-2xl p-4 sm:p-5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <span className="font-bold uppercase tracking-wider block text-amber-700 dark:text-amber-300">
              Responsible Usage Notice
            </span>
            <p className="leading-relaxed">
              Use these tools only on systems, domains, and networks you own or have explicit written permission to test. Nexus Hub is designed strictly for educational, defensive, and authorized administrative diagnostics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-500" />
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                NEXUS HUB
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              High-speed, browser-native cybersecurity toolkit for beginners, IT staff, and security teams. 100% client-side computing with zero server tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Web Crypto API & Zero-Knowledge Architecture</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Tools & Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/tools/ip-tracker" className="hover:text-cyan-500 transition-colors">IP Tracker</Link></li>
              <li><Link to="/tools/dns-recon" className="hover:text-cyan-500 transition-colors">DNS Recon</Link></li>
              <li><Link to="/tools/password-auditor" className="hover:text-cyan-500 transition-colors">Password Auditor</Link></li>
              <li><Link to="/tools/crypto-vault" className="hover:text-cyan-500 transition-colors">Crypto Vault</Link></li>
              <li><Link to="/tools/file-integrity" className="hover:text-cyan-500 transition-colors">File Integrity</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Legal & Transparency
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-cyan-500 transition-colors">About Nexus Hub</Link></li>
              <li><Link to="/privacy" className="hover:text-cyan-500 transition-colors">Privacy Policy & Non-Logging</Link></li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Source Code & Auditing
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Nexus Hub. Open cybersecurity for everyone.</p>
          <p className="flex items-center gap-1">
            Built with pure client-side privacy.
          </p>
        </div>
      </div>
    </footer>
  );
}
