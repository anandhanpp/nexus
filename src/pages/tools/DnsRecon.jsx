import React, { useState } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { runDnsRecon } from '../../utils/dns';
import { TOOLS } from '../../data/toolsData';
import { ShieldAlert, ShieldCheck, Mail, Database } from 'lucide-react';

const RECORD_TABS = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA'];

export default function DnsRecon() {
  const toolMeta = TOOLS.find(t => t.id === 'dns-recon');
  const [domainInput, setDomainInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('A');

  const handleLookup = async (overrideDomain = null) => {
    const domain = (overrideDomain !== null ? overrideDomain : domainInput).trim();
    setError(null);

    if (!domain) {
      setError('Please enter a domain name to recon (e.g. cloudflare.com or google.com)');
      return;
    }

    setLoading(true);
    try {
      const data = await runDnsRecon(domain);
      
      const totalRecords = Object.values(data.records).reduce((sum, arr) => sum + arr.length, 0);
      const summary = `${data.security.verdict} • ${data.domain}`;
      const explanation = data.security.explanation;

      const rawExport = `NEXUS DNS RECON REPORT
Domain: ${data.domain}
Spoofing Protection Status: ${data.security.verdict}
SPF Detected: ${data.security.hasSpf ? 'Yes' : 'No'}
DMARC Detected: ${data.security.hasDmarc ? 'Yes' : 'No'}
Total DNS Answers: ${totalRecords}
Timestamp: ${new Date().toISOString()}

RECORDS:
${Object.entries(data.records)
  .filter(([_, recs]) => recs.length > 0)
  .map(([type, recs]) => `[${type}]\n${recs.map(r => `  - ${r}`).join('\n')}`)
  .join('\n\n')}`;

      setResult({
        status: data.security.status,
        summary,
        explanation,
        rawTextForExport: rawExport,
        details: (
          <div className="space-y-6">
            {/* SPF & DMARC Security Overview */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500" />
                Email Phishing & Anti-Spoofing Posture
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className={`p-3 rounded-lg border ${data.security.hasSpf ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'}`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {data.security.hasSpf ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4 text-rose-500" />}
                    SPF Record (Sender Policy Framework)
                  </div>
                  <div className="mt-1 font-mono text-[11px] truncate">
                    {data.security.hasSpf ? data.security.spfRecord : 'Missing: No SPF record configured'}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${data.security.hasDmarc ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'}`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {data.security.hasDmarc ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4 text-rose-500" />}
                    DMARC Record (Domain-based Message Authentication)
                  </div>
                  <div className="mt-1 font-mono text-[11px] truncate">
                    {data.security.hasDmarc ? data.security.dmarcRecord : 'Missing: No DMARC policy configured'}
                  </div>
                </div>
              </div>
            </div>

            {/* DNS Records Tabs */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
                {RECORD_TABS.map(tab => {
                  const count = (data.records[tab] || []).length;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === tab
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span>{tab}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab ? 'bg-cyan-700 text-cyan-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                {(!data.records[activeTab] || data.records[activeTab].length === 0) ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic py-2">
                    No {activeTab} records returned for {data.domain}.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {data.records[activeTab].map((rec, i) => (
                      <li key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950/80 border border-slate-100 dark:border-slate-800/80 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 break-all select-all">
                        {rec}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )
      });
    } catch (err) {
      setError(err.message || 'DNS Recon failed. Please verify the domain and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (domain) => {
    setDomainInput(domain);
    handleLookup(domain);
  };

  return (
    <ToolPage
      toolId="dns-recon"
      title="DNS Recon & Email Anti-Spoofing Auditor"
      description="Inspect A, AAAA, MX, NS, and TXT records over encrypted DNS (DoH), and verify whether SPF & DMARC prevent attackers from forging emails."
      actionButtonText="Recon Domain"
      onAction={() => handleLookup()}
      loading={loading}
      error={error}
      result={result}
      onClear={() => {
        setDomainInput('');
        setResult(null);
        setError(null);
      }}
      helpLines={toolMeta?.helpText || []}
      relatedToolIds={toolMeta?.related || []}
      inputElement={
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="domain-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Domain Name
            </label>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Try:</span>
              <button 
                type="button" 
                onClick={() => handleExample('cloudflare.com')}
                className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                cloudflare.com
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleExample('github.com')}
                className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                github.com
              </button>
            </div>
          </div>
          <input
            id="domain-input"
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="e.g. google.com or proton.me"
            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-base transition-colors"
          />
        </div>
      }
    />
  );
}
