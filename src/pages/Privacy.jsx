import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, AlertCircle } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 animate-fadeIn">
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero-Knowledge Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          The core rule of Nexus Hub: <strong>Nothing you enter leaves your device</strong>, except for external network lookups explicitly described below.
        </p>
      </header>

      {/* Main Guarantee Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No Passwords or Keys Saved
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your passwords, generated secrets, and vault contents exist exclusively in your browser's private memory and encrypted local storage.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Zero Tracking & Cookies
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We do not use Google Analytics, tracking pixels, session replays, advertising cookies, or behavioral fingerprinting.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No Server Backend
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Nexus Hub is a purely static bundle. All cryptography (AES-GCM, PBKDF2, SHA-256) is executed by the W3C Web Crypto API natively on your CPU.
          </p>
        </div>
      </section>

      {/* External Network Requests Transparency */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Transparent List of External API Calls
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Because web browsers cannot query raw BGP routing tables or authoritative nameservers without native sockets, the following three tools utilize public HTTPS APIs:
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-navy-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-4 sm:p-5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">1. IP Tracker (ipapi.co)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-300">HTTPS GET</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Sends the target IP address to query public geolocation and ASN records.
              </p>
            </div>

            <div className="p-4 sm:p-5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">2. DNS Recon (Cloudflare & Google DoH)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-300">HTTPS GET (DoH JSON)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Sends the domain name to Cloudflare (1.1.1.1) or Google (8.8.8.8) encrypted DNS-over-HTTPS endpoints to resolve standard DNS records (A, MX, TXT).
              </p>
            </div>

            <div className="p-4 sm:p-5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">3. HaveIBeenPwned k-Anonymity (api.pwnedpasswords.com)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">k-Anonymity Protected</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                When you click "Check for Known Leaks", the tool hashes your password with SHA-1 locally and sends <strong>only the first 5 hexadecimal characters</strong> of that hash. Your actual password and remaining 35 characters are never transmitted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Only Tools */}
      <section className="p-6 rounded-2xl bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          100% Offline / Non-Network Tools:
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The <strong>Subnet Calculator</strong>, <strong>MAC Recon</strong> (bundled OUI database), <strong>Cryptographic Engine</strong>, <strong>Crypto Vault</strong>, and <strong>File Integrity Monitor</strong> do not make any network requests. They function fully even when your device is completely disconnected from the internet.
        </p>
      </section>
    </div>
  );
}
