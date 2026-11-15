import React, { useState, useEffect } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { auditPassword, checkPwnedPassword, generatePassword } from '../../utils/password';
import { TOOLS } from '../../data/toolsData';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  Lock, 
  Sparkles,
  Copy
} from 'lucide-react';

export default function PasswordAuditor() {
  const toolMeta = TOOLS.find(t => t.id === 'password-auditor');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [leakChecking, setLeakChecking] = useState(false);
  const [leakResult, setLeakResult] = useState(null);
  const [copiedGen, setCopiedGen] = useState(false);

  // Generator state
  const [genLength, setGenLength] = useState(16);
  const [genOptions, setGenOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const audit = auditPassword(password);

  const handleLeakCheck = async () => {
    if (!password) return;
    setLeakChecking(true);
    setLeakResult(null);
    try {
      const res = await checkPwnedPassword(password);
      setLeakResult(res);
    } catch {
      setLeakResult({ error: 'Could not contact HaveIBeenPwned service. Check connection.' });
    } finally {
      setLeakChecking(false);
    }
  };

  const handleGenerate = () => {
    const generated = generatePassword({
      length: genLength,
      ...genOptions
    });
    setPassword(generated);
    setLeakResult(null);
  };

  // Reset leak result when password changes
  useEffect(() => {
    setLeakResult(null);
  }, [password]);

  const strengthColorMap = {
    'Very Weak': 'bg-rose-500',
    'Weak': 'bg-rose-500',
    'Fair': 'bg-amber-500',
    'Strong': 'bg-emerald-500',
    'Excellent': 'bg-cyan-500'
  };

  const status = password.length === 0 
    ? null 
    : (leakResult?.leaked ? 'danger' : audit.badgeColor);

  const summary = password.length === 0
    ? 'Enter a password to evaluate'
    : leakResult?.leaked
      ? `Compromised! Found in ${leakResult.count.toLocaleString()} known data breaches`
      : `${audit.label} Password • Estimated Crack Time: ${audit.crackTime}`;

  const explanation = password.length === 0
    ? 'Passwords are analyzed in real time inside your browser memory.'
    : leakResult?.leaked
      ? `This exact password has appeared ${leakResult.count.toLocaleString()} times in publicly disclosed data breaches. Attackers use automated dictionary scripts containing these hashes.`
      : `With roughly ${audit.entropy} bits of entropy, a high-end password cracking rig would take ${audit.crackTime} to guess this combination.`;

  const rawExport = `NEXUS PASSWORD AUDIT REPORT
Password Length: ${password.length}
Strength Score: ${audit.score} / 7 (${audit.label})
Estimated Crack Time: ${audit.crackTime}
Calculated Entropy: ${audit.entropy} bits
Breach Status: ${leakResult ? (leakResult.leaked ? `LEAKED (${leakResult.count} times)` : 'Safe / Not in public leaks') : 'Not checked'}
Checklist:
  - 8+ characters: ${audit.checklist.length ? 'PASS' : 'FAIL'}
  - 12+ characters: ${audit.checklist.length12 ? 'PASS' : 'FAIL'}
  - Lowercase letters: ${audit.checklist.lowercase ? 'PASS' : 'FAIL'}
  - Uppercase letters: ${audit.checklist.uppercase ? 'PASS' : 'FAIL'}
  - Numbers: ${audit.checklist.numbers ? 'PASS' : 'FAIL'}
  - Special Symbols: ${audit.checklist.symbols ? 'PASS' : 'FAIL'}
  - No common sequences: ${audit.checklist.noSequences ? 'PASS' : 'FAIL'}
  - Not a common dictionary word: ${audit.checklist.notCommon ? 'PASS' : 'FAIL'}
Timestamp: ${new Date().toISOString()}`;

  const resultData = password.length > 0 ? {
    status: status || 'info',
    summary,
    explanation,
    rawTextForExport: rawExport,
    details: (
      <div className="space-y-6">
        {/* Entropy & Crack time badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block uppercase font-semibold">Security Strength</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{audit.label}</span>
            <span className="text-xs text-slate-400 block mt-0.5">{audit.score} / 7 criteria met</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block uppercase font-semibold">Brute-Force Estimate</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{audit.crackTime}</span>
            <span className="text-xs text-slate-400 block mt-0.5">@ 10 Billion guesses/sec</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block uppercase font-semibold">Shannon Entropy</span>
            <span className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">{audit.entropy} bits</span>
            <span className="text-xs text-slate-400 block mt-0.5">Length: {password.length} chars</span>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Complexity & Hygiene Checklist
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center gap-2 p-2 rounded-lg ${audit.checklist.length ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-navy-950'}`}>
              {audit.checklist.length ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4" />}
              <span>At least 8 characters (12+ recommended)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${audit.checklist.length12 ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-navy-950'}`}>
              {audit.checklist.length12 ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4" />}
              <span>12+ characters for high security</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${audit.checklist.lowercase ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-navy-950'}`}>
              {audit.checklist.lowercase ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4" />}
              <span>Lowercase letters (a–z)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${audit.checklist.uppercase ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-navy-950'}`}>
              {audit.checklist.uppercase ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4" />}
              <span>Uppercase letters (A–Z)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${audit.checklist.numbers ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-navy-950'}`}>
              {audit.checklist.numbers ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4" />}
              <span>Numeric digits (0–9)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${audit.checklist.symbols ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-navy-950'}`}>
              {audit.checklist.symbols ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4" />}
              <span>Special symbols (!@#$%^&*)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${audit.checklist.noSequences ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-rose-700 dark:text-rose-400 bg-rose-500/10'}`}>
              {audit.checklist.noSequences ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
              <span>No predictable sequences (e.g. 1234, qwerty)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${audit.checklist.notCommon ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-rose-700 dark:text-rose-400 bg-rose-500/10'}`}>
              {audit.checklist.notCommon ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
              <span>Not in common dictionary wordlist</span>
            </div>
          </div>
        </div>

        {/* Improvement Tips */}
        {audit.tips.length > 0 && (
          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
              Improvement Recommendations:
            </span>
            <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
              {audit.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  } : null;

  return (
    <ToolPage
      toolId="password-auditor"
      title="Password Strength & Breach Auditor"
      description="Test password entropy, estimated time to crack, and safely verify against known breach feeds via k-anonymity without revealing your password."
      actionButtonText="Check for Known Leaks (k-Anonymity)"
      onAction={handleLeakCheck}
      loading={leakChecking}
      result={resultData}
      onClear={() => {
        setPassword('');
        setLeakResult(null);
      }}
      helpLines={toolMeta?.helpText || []}
      relatedToolIds={toolMeta?.related || []}
      inputElement={
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password or Passphrase
              </label>
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Server Upload: Evaluated 100% in Browser</span>
              </div>
            </div>

            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type or generate a password to inspect..."
                className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-base transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Live Progress Strength Bar */}
            {password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Strength Rating:</span>
                  <span className="text-slate-900 dark:text-white">{audit.label}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 transition-all duration-300 rounded-full ${
                        step <= audit.score
                          ? strengthColorMap[audit.label] || 'bg-cyan-500'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Built-in Generator Accordion / Panel */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-navy-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                Strong Password Generator
              </span>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generate New</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <label htmlFor="gen-len" className="text-slate-500 font-medium">Length ({genLength}):</label>
                <input
                  id="gen-len"
                  type="range"
                  min="8"
                  max="64"
                  value={genLength}
                  onChange={(e) => setGenLength(parseInt(e.target.value, 10))}
                  className="w-24 accent-cyan-500"
                />
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={genOptions.uppercase}
                  onChange={(e) => setGenOptions({ ...genOptions, uppercase: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>A-Z</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={genOptions.lowercase}
                  onChange={(e) => setGenOptions({ ...genOptions, lowercase: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>a-z</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={genOptions.numbers}
                  onChange={(e) => setGenOptions({ ...genOptions, numbers: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>0-9</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={genOptions.symbols}
                  onChange={(e) => setGenOptions({ ...genOptions, symbols: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>Symbols (!@#)</span>
              </label>
            </div>
          </div>
        </div>
      }
    />
  );
}
