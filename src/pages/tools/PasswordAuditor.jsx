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

  useEffect(() => {
    setLeakResult(null);
  }, [password]);

  const strengthColorMap = {
    'Very Weak': 'bg-rose-500',
    'Weak': 'bg-rose-500',
    'Fair': 'bg-amber-500',
    'Strong': 'bg-emerald-500',
    'Excellent': 'bg-emerald-400'
  };

  const status = password.length === 0 
    ? null 
    : (leakResult?.leaked ? 'danger' : audit.badgeColor);

  const summary = password.length === 0
    ? 'Enter a password to evaluate'
    : leakResult?.leaked
      ? `COMPROMISED // Seen in ${leakResult.count.toLocaleString()} Breaches`
      : `${audit.label} Password • Estimated Crack Time: ${audit.crackTime}`;

  const explanation = password.length === 0
    ? 'Passwords are analyzed in real time inside your browser memory.'
    : leakResult?.leaked
      ? `This exact hash appears ${leakResult.count.toLocaleString()} times in publicly disclosed credential breaches. Attackers include these in automated credential-stuffing dictionaries.`
      : `With ${audit.entropy} bits of Shannon entropy, a GPU brute-force cluster guessing 10 billion combinations per second would require ~${audit.crackTime} to exhaust the search space.`;

  const rawExport = `NEXUS PASSWORD AUDIT REPORT
Length: ${password.length} characters
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
      <div className="space-y-4">
        {/* Entropy & Crack time badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Complexity Score</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white block mt-0.5">{audit.label}</span>
            <span className="text-[10px] font-mono text-slate-500">{audit.score} / 7 criteria met</span>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Brute-Force Resistance</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white truncate block mt-0.5">{audit.crackTime}</span>
            <span className="text-[10px] font-mono text-slate-500">@ 10B guesses/sec</span>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Shannon Entropy</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{audit.entropy} bits</span>
            <span className="text-[10px] font-mono text-slate-500">Length: {password.length} chars</span>
          </div>
        </div>

        {/* Complexity Checklist */}
        <div className="p-4 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            HYGIENE & PATTERN VERIFICATION
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className={`flex items-center gap-2 p-2 rounded ${audit.checklist.length ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-carbon-850'}`}>
              {audit.checklist.length ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5" />}
              <span>8+ characters minimum</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded ${audit.checklist.length12 ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-carbon-850'}`}>
              {audit.checklist.length12 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5" />}
              <span>12+ characters recommended</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded ${audit.checklist.lowercase ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-carbon-850'}`}>
              {audit.checklist.lowercase ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5" />}
              <span>Lowercase letters (a–z)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded ${audit.checklist.uppercase ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-carbon-850'}`}>
              {audit.checklist.uppercase ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5" />}
              <span>Uppercase letters (A–Z)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded ${audit.checklist.numbers ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-carbon-850'}`}>
              {audit.checklist.numbers ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5" />}
              <span>Numeric digits (0–9)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded ${audit.checklist.symbols ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-carbon-850'}`}>
              {audit.checklist.symbols ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5" />}
              <span>Special symbols (!@#$%^&*)</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded ${audit.checklist.noSequences ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-rose-700 dark:text-rose-400 bg-rose-500/10'}`}>
              {audit.checklist.noSequences ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
              <span>No predictable sequences</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded ${audit.checklist.notCommon ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10' : 'text-rose-700 dark:text-rose-400 bg-rose-500/10'}`}>
              {audit.checklist.notCommon ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
              <span>Not in common dictionary list</span>
            </div>
          </div>
        </div>

        {/* Improvement Guidance */}
        {audit.tips.length > 0 && (
          <div className="p-3.5 rounded-lg bg-slate-100/60 dark:bg-carbon-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              HARDENING RECOMMENDATIONS:
            </span>
            <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside space-y-0.5">
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
      title="Password Resilience & Breach Auditor"
      description="Calculate Shannon entropy, GPU brute-force crack times, and safely test against breached credential databases via k-anonymity."
      actionButtonText="CHECK LEAK FEEDS (K-ANONYMITY)"
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
              <label htmlFor="password-input" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                CREDENTIAL PASSPHRASE
              </label>
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                <Lock className="w-3 h-3" />
                <span>EVALUATED IN RAM ONLY</span>
              </div>
            </div>

            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type or generate a passphrase to audit..."
                className="w-full pl-3.5 pr-10 py-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Progress Strength Bar */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">ENTROPY METRIC:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{audit.label}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-carbon-800 overflow-hidden flex gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 transition-all duration-200 rounded-full ${
                        step <= audit.score
                          ? strengthColorMap[audit.label] || 'bg-emerald-500'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tactical Generator Box */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-carbon-900/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                CRYPTO PASSWORD GENERATOR
              </span>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>GENERATE NEW</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <label htmlFor="gen-len" className="text-slate-400">LENGTH ({genLength}):</label>
                <input
                  id="gen-len"
                  type="range"
                  min="8"
                  max="64"
                  value={genLength}
                  onChange={(e) => setGenLength(parseInt(e.target.value, 10))}
                  className="w-24 accent-emerald-500"
                />
              </div>

              <label className="flex items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={genOptions.uppercase}
                  onChange={(e) => setGenOptions({ ...genOptions, uppercase: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>A-Z</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={genOptions.lowercase}
                  onChange={(e) => setGenOptions({ ...genOptions, lowercase: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>a-z</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={genOptions.numbers}
                  onChange={(e) => setGenOptions({ ...genOptions, numbers: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>0-9</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={genOptions.symbols}
                  onChange={(e) => setGenOptions({ ...genOptions, symbols: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Symbols</span>
              </label>
            </div>
          </div>
        </div>
      }
    />
  );
}
