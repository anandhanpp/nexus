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
  HelpCircle,
  ArrowRight,
  ShieldAlert
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
  result = null, // { status: 'safe'|'warning'|'danger'|'info', summary: string, explanation: string, details?: ReactNode, rawTextForExport?: string }
  onClear,
  helpLines = [],
  relatedToolIds = [],
  children
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Status badge config with both icon and text (never color alone)
  const statusConfig = {
    safe: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />,
      label: 'Safe / Passed'
    },
    warning: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />,
      label: 'Notice / Caution'
    },
    danger: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 border-rose-500/30',
      icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />,
      label: 'Action Required / Danger'
    },
    info: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-500/30',
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />,
      label: 'Information Ready'
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
    a.download = `${toolId}-result-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const relatedTools = TOOLS.filter(t => relatedToolIds.includes(t.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* a) Title + Plain-English Description */}
      <header className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
          <span>Nexus Cybersecurity Toolkit</span>
          <span>•</span>
          <span className="capitalize">{toolId.replace('-', ' ')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </header>

      {/* b) INPUT Area */}
      <section aria-label="Tool Input" className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onAction) onAction();
          }}
          className="space-y-4"
        >
          {inputElement}

          {/* Error Message */}
          {error && (
            <div 
              role="alert" 
              className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-sm"
            >
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to process input</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Children slots for tools with auxiliary non-obtrusive options */}
          {children}

          {onAction && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold shadow-md shadow-cyan-900/20 hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-navy-950 transition-all flex items-center gap-2 text-base cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{actionButtonText}</span>
                )}
              </button>

              {onClear && (result || error) && (
                <button
                  type="button"
                  onClick={onClear}
                  className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          )}
        </form>
      </section>

      {/* c) RESULT Area */}
      {result && (
        <section 
          aria-label="Analysis Results"
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-xl overflow-hidden transition-all duration-300"
        >
          {/* Summary & Verdict Banner */}
          <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div 
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-semibold ${
                  (statusConfig[result.status] || statusConfig.info).bg
                }`}
              >
                {(statusConfig[result.status] || statusConfig.info).icon}
                <span>{(statusConfig[result.status] || statusConfig.info).label}</span>
              </div>

              {/* Action Buttons: Copy, Download, Clear */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy result text to clipboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  title="Download result report as text file"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Big Plain-English Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {result.summary}
              </h2>
              {result.explanation && (
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {result.explanation}
                </p>
              )}
            </div>
          </div>

          {/* d) "Show details" toggle for technical data */}
          {result.details && (
            <div className="border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                aria-expanded={showDetails}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors"
              >
                <span>{showDetails ? 'Hide Technical Details' : 'Show Technical Details'}</span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDetails && (
                <div className="px-6 py-5 bg-slate-50/80 dark:bg-navy-950/60 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
                  {result.details}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* f) "What does this mean?" help box */}
      {helpLines && helpLines.length > 0 && (
        <aside 
          aria-label="Educational Guidance"
          className="rounded-2xl p-6 bg-slate-100/70 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800/80 space-y-3"
        >
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
            <HelpCircle className="w-4 h-4 text-cyan-500" />
            <h3>What does this mean?</h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
            {helpLines.map((line, idx) => (
              <li key={idx} className="leading-relaxed">{line}</li>
            ))}
          </ul>
        </aside>
      )}

      {/* g) Related tools links at the bottom */}
      {relatedTools.length > 0 && (
        <nav aria-label="Related Tools" className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
            Related Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedTools.map((rt) => (
              <Link
                key={rt.id}
                to={rt.path}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/70 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-navy-800 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-cyan-500 transition-colors">
                    {rt.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {rt.shortDesc}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
