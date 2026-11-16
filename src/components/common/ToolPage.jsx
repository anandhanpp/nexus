import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  ArrowUpRight,
  ShieldAlert,
  Terminal
} from 'lucide-react';
import { TOOLS } from '../../data/toolsData';

export default function ToolPage({
  toolId,
  title,
  description,
  inputElement,
  actionButtonText = 'Analyze',
  onAction,
  loading = false,
  error = null,
  result = null,
  onClear,
  helpLines = [],
  relatedToolIds = [],
  children
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const toolMeta = TOOLS.find(t => t.id === toolId);

  // Status configuration: Minimalist high-contrast ex8.tech palette
  const statusConfig = {
    safe: {
      border: 'border-white/30',
      badge: 'bg-white text-black border border-white font-bold',
      dot: 'bg-emerald-400',
      label: 'SAFE // VERIFIED'
    },
    warning: {
      border: 'border-amber-500/50',
      badge: 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-bold',
      dot: 'bg-amber-400',
      label: 'WARNING // REVIEW'
    },
    danger: {
      border: 'border-rose-500/50',
      badge: 'bg-rose-950/40 text-rose-300 border border-rose-500/40 font-bold',
      dot: 'bg-rose-400',
      label: 'DANGER // ALERT'
    },
    info: {
      border: 'border-white/20',
      badge: 'bg-zinc-900 text-white border border-white/30 font-bold',
      dot: 'bg-white',
      label: 'NOMINAL // READY'
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = result.rawTextForExport || `${result.summary}\n${result.explanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const textToExport = result.rawTextForExport || `${result.summary}\n\n${result.explanation}`;
    const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ex8-${toolId}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const relatedTools = TOOLS.filter(t => relatedToolIds.includes(t.id));
  const currentStatus = statusConfig[result?.status] || statusConfig.info;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fadeIn text-white">
      {/* 1. Breadcrumb Header & Chunky Pixel Title */}
      <header className="space-y-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tracking-widest uppercase text-zinc-500">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">OUR APPS</Link>
            <span>//</span>
            <span className="text-white font-bold">
              {toolMeta?.code || 'APP'}
            </span>
          </div>
          <span className="px-2 py-0.5 border border-white/20 text-zinc-400 text-[10px]">
            {toolMeta?.mode || '100% CLIENT-SIDE'}
          </span>
        </div>

        <h1 className="font-pixel text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
          {description}
        </p>
      </header>

      {/* 2. INPUT AREA: Minimalist black container with hairline borders */}
      <section aria-label="Tool Input" className="border border-white/20 bg-black p-5 sm:p-7 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onAction) onAction();
          }}
          className="space-y-4"
        >
          {inputElement}

          {/* Validation error box */}
          {error && (
            <div 
              role="alert" 
              className="flex items-start gap-3 p-3.5 border border-rose-500/50 bg-rose-950/20 text-rose-300 text-xs font-mono"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5 tracking-wider uppercase">INPUT FAULT</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          {children}

          {onAction && (
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-white text-black font-mono text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <span>{actionButtonText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {onClear && (result || error) && (
                <button
                  type="button"
                  onClick={onClear}
                  className="px-4 py-2.5 border border-white/20 hover:border-white text-zinc-400 hover:text-white text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
              )}
            </div>
          )}
        </form>
      </section>

      {/* 3. RESULT AREA: High-contrast ex8.tech telemetry card */}
      {result && (
        <section 
          aria-label="Analysis Results"
          className={`border ${currentStatus.border} bg-black overflow-hidden animate-fadeIn space-y-4`}
        >
          <div className="p-5 sm:p-7 space-y-4">
            {/* Status Header & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase ${currentStatus.badge}`}>
                <span className={`w-2 h-2 rounded-full ${currentStatus.dot} animate-pulse`}></span>
                <span>{currentStatus.label}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy result text"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider border border-white/20 hover:border-white text-zinc-300 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  title="Export result"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider border border-white/20 hover:border-white text-zinc-300 hover:text-white transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>EXPORT</span>
                </button>
              </div>
            </div>

            {/* Plain-English Briefing */}
            <div className="space-y-1.5">
              <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wide">
                {result.summary}
              </h2>
              {result.explanation && (
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {result.explanation}
                </p>
              )}
            </div>
          </div>

          {/* Technical Details Toggle */}
          {result.details && (
            <div className="border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                aria-expanded={showDetails}
                className="w-full px-5 py-3 flex items-center justify-between text-left text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white hover:bg-zinc-950 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{showDetails ? 'COLLAPSE TECHNICAL DATA' : 'INSPECT TECHNICAL DATA & TELEMETRY'}</span>
                </span>
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showDetails && (
                <div className="p-5 sm:p-7 bg-zinc-950 border-t border-white/10 space-y-4 font-mono text-xs">
                  {result.details}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* 4. Operational Context / Manual */}
      {helpLines && helpLines.length > 0 && (
        <aside 
          aria-label="Operational Context"
          className="border border-white/15 bg-black p-5 sm:p-6 space-y-3"
        >
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-white">
              WHAT DOES THIS MEAN?
            </h3>
            <div className="w-6 h-[2px] bg-white my-1.5"></div>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
            {helpLines.map((line, idx) => (
              <li key={idx} className="leading-relaxed flex items-start gap-2">
                <span className="text-zinc-600 font-mono">—</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* 5. Adjacent Modules */}
      {relatedTools.length > 0 && (
        <nav aria-label="Related Tools" className="pt-4 border-t border-white/10">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-3">
            ADJACENT APPLICATIONS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((rt) => (
              <Link
                key={rt.id}
                to={rt.path}
                className="group p-4 border border-white/15 bg-black hover:border-white transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-sans text-xs font-bold uppercase tracking-wider text-white group-hover:text-zinc-300">
                    {rt.name}
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500 mt-0.5">
                    {rt.code} // {rt.mode.split(' ')[0]}
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
