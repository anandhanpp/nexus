import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-12 animate-fadeIn text-white">
      {/* Header */}
      <header className="space-y-4 border-b border-white/10 pb-8">
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 block">
          SPECIFICATION // ARCHITECTURE & GOALS
        </span>
        <h1 className="font-pixel text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-tight">
          ABOUT EX8 // NEXUS
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl font-sans">
          A minimalist, browser-native cybersecurity workstation built for developers, sysadmins, and security analysts who need immediate verification with zero cloud telemetry.
        </p>
      </header>

      {/* Target Audiences */}
      <section className="space-y-6">
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-white">
            OPERATIONAL AUDIENCES
          </h3>
          <div className="w-8 h-[2px] bg-white my-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-white/15 bg-black space-y-2">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider block">
              01 // IT & SYSADMINS
            </span>
            <h4 className="font-sans font-bold text-white uppercase tracking-wide text-sm">
              Instant Triage
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Subnet allocation planning, MAC OUI vendor lookups, and DoH DNS records without opening terminal command-lines or installing CLI tools.
            </p>
          </div>

          <div className="p-6 border border-white/15 bg-black space-y-2">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider block">
              02 // DEVELOPERS
            </span>
            <h4 className="font-sans font-bold text-white uppercase tracking-wide text-sm">
              Crypto Primitives
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Testing HMAC, SHA-256 digests, Base64/Hex encoding, and AES-GCM payloads with verifiable byte-level outputs.
            </p>
          </div>

          <div className="p-6 border border-white/15 bg-black space-y-2">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider block">
              03 // DEFENSIVE ANALYSTS
            </span>
            <h4 className="font-sans font-bold text-white uppercase tracking-wide text-sm">
              Integrity & Leaks
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              In-browser streaming file hashing for tamper verification and k-anonymity SHA-1 leak audits with zero password exposure.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural Principles */}
      <section className="space-y-6">
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-white">
            ARCHITECTURAL SPECIFICATION
          </h3>
          <div className="w-8 h-[2px] bg-white my-2"></div>
        </div>

        <div className="border border-white/15 divide-y divide-white/10 text-xs font-mono">
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white uppercase">Client-Side Runtime</span>
              <p className="text-zinc-400 font-sans mt-0.5">Execution occurs strictly within browser JavaScript threads; zero middleman servers.</p>
            </div>
            <span className="text-zinc-500 uppercase shrink-0">W3C SUBTLECRYPTO</span>
          </div>

          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white uppercase">Memory Isolation</span>
              <p className="text-zinc-400 font-sans mt-0.5">Encrypted notes and temporary payloads are cleared upon session destruction.</p>
            </div>
            <span className="text-zinc-500 uppercase shrink-0">ZERO PERSISTENCE</span>
          </div>

          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white uppercase">DoH Standards</span>
              <p className="text-zinc-400 font-sans mt-0.5">Direct encrypted DNS lookup via Cloudflare and Google DoH JSON endpoints.</p>
            </div>
            <span className="text-zinc-500 uppercase shrink-0">RFC 8484</span>
          </div>
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
          to="/privacy"
          className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white underline underline-offset-4 decoration-white/30"
        >
          READ ZERO-TELEMETRY AUDIT
        </Link>
      </div>
    </div>
  );
}
