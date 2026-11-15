import React from 'react';
import { Shield, Zap, Lock, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 animate-fadeIn">
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
          <span>Mission & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About Nexus Hub
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Building fast, accessible, zero-knowledge cybersecurity tools that anyone can use in under 10 seconds without training or specialized setup.
        </p>
      </header>

      {/* Target Audiences */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Built for Three Distinct Audiences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Beginners & Everyday Users
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Plain-English verdicts, no confusing jargon, clear color + icon status indicators, and actionable guidance in simple sentences.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              IT Staff & Helpdesk
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Rapid troubleshooting tools like Subnet Calculator, MAC OUI vendor lookups, and DoH DNS records with zero software installation required.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Security Professionals
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              "Show Details" toggles reveal raw 32-bit binary masks, full DNS answers, Shannon entropy calculations, and AES-GCM primitives.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Principles */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Architectural Principles
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 dark:text-white">100% Client-Side Computing:</strong> All calculations, cryptographic hashing, key derivations, and note encryptions run locally in your browser memory via the native W3C Web Crypto API.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 dark:text-white">No Backend / No Data Harvesting:</strong> Nexus Hub operates with zero servers, zero cookies, zero advertising trackers, and zero user accounts.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 dark:text-white">Under 10-Second Workflows:</strong> Single unified tool template, intuitive inputs, clear primary action buttons, and immediate feedback.
            </p>
          </div>
        </div>
      </section>

      <section className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Ready to test your systems?</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Explore all 8 available security utilities right now.</p>
        </div>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-2"
        >
          <span>Explore All Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
