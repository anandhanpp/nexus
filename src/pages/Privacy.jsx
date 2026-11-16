import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-12 animate-fadeIn text-white">
      {/* Header */}
      <header className="space-y-4 border-b border-white/10 pb-8">
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 block">
          DECLARATION // ZERO-LOG & LOCAL RUNTIME
        </span>
        <h1 className="font-pixel text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-tight">
          PRIVACY & EGRESS AUDIT
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-2xl">
          EX8 // Nexus Hub is engineered with a strict operational tenet: <strong>zero plaintext data leaves your device</strong>, except for documented public network lookups.
        </p>
      </header>

      {/* 3 Core Guarantees */}
      <section className="space-y-6">
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-white">
            SECURITY GUARANTEES
          </h3>
          <div className="w-8 h-[2px] bg-white my-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-white/15 bg-black space-y-2">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider block">
              01 // EPHEMERAL RAM
            </span>
            <h4 className="font-sans font-bold text-white uppercase tracking-wide text-sm">
              No Plaintext Retention
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Passwords, master keys, and file contents exist strictly inside your browser's private memory heap during the active turn.
            </p>
          </div>

          <div className="p-6 border border-white/15 bg-black space-y-2">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider block">
              02 // ZERO TRACKING
            </span>
            <h4 className="font-sans font-bold text-white uppercase tracking-wide text-sm">
              No Telemetry or Cookies
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Zero Google Analytics, tracking pixels, session replays, third-party advertising cookies, or behavioral telemetry.
            </p>
          </div>

          <div className="p-6 border border-white/15 bg-black space-y-2">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider block">
              03 // STATIC ARCHITECTURE
            </span>
            <h4 className="font-sans font-bold text-white uppercase tracking-wide text-sm">
              No Backend Database
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Hosted purely as static distribution files. There is no server-side SQL, Redis, or cloud pipeline logging payload buffers.
            </p>
          </div>
        </div>
      </section>

      {/* Network Egress Matrix */}
      <section className="space-y-6">
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-white">
            NETWORK EGRESS AUDIT
          </h3>
          <div className="w-8 h-[2px] bg-white my-2"></div>
        </div>

        <div className="border border-white/15 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 border-b border-white/10 text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Utility</th>
                <th className="p-4">External Endpoint</th>
                <th className="p-4">Payload Sent</th>
                <th className="p-4">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-zinc-300">
              <tr>
                <td className="p-4 font-bold text-white">IP Tracker</td>
                <td className="p-4 text-zinc-400">ipapi.co / api.country.is</td>
                <td className="p-4">Target IP Address only</td>
                <td className="p-4">Autonomous System & Geo-coordinates</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">DNS Recon</td>
                <td className="p-4 text-zinc-400">cloudflare-dns.com / dns.google</td>
                <td className="p-4">Domain Name + RR Type</td>
                <td className="p-4">DNS-over-HTTPS Record Resolution</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Password Auditor</td>
                <td className="p-4 text-zinc-400">api.pwnedpasswords.com</td>
                <td className="p-4">5-char SHA-1 Prefix (k-Anonymity)</td>
                <td className="p-4">Compromise Check (Password Never Sent)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">All Other 5 Tools</td>
                <td className="p-4 text-emerald-400">NONE (100% Offline)</td>
                <td className="p-4">Zero Bytes Transmitted</td>
                <td className="p-4">Pure Local Bitwise / WebCrypto Math</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Back to Apps */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
        >
          <span>BROWSE ALL APPS</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to="/about"
          className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white underline underline-offset-4 decoration-white/30"
        >
          VIEW ARCHITECTURE
        </Link>
      </div>
    </div>
  );
}
