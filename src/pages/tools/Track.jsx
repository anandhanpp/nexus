import React, { useState } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { analyzePhoneNumber, buildUsernameLinks, analyzeEmail } from '../../utils/track';
import { TOOLS } from '../../data/toolsData';
import { Phone, User, Mail, ExternalLink, Clock, Globe, ChevronDown, ChevronUp } from 'lucide-react';

const TABS = [
  { id: 'phone',    label: 'Phone Tracker',          icon: Phone },
  { id: 'username', label: 'Username & Email OSINT',  icon: User  },
];

// ── Reusable detail card ──────────────────────────────────────────────────────
function InfoCard({ label, value, mono = false }) {
  return (
    <div className="p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">{label}</span>
      <span className={`text-xs font-semibold text-slate-900 dark:text-white break-all ${mono ? 'font-mono' : ''}`}>
        {value ?? '—'}
      </span>
    </div>
  );
}

// ── Phone Tracker ─────────────────────────────────────────────────────────────
function PhoneTracker() {
  const [input, setInput]   = useState('');
  const [error, setError]   = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    setError(null);
    try {
      const d = analyzePhoneNumber(input);

      const statusColor = { safe: 'emerald', warning: 'amber', danger: 'rose' }[d.status] || 'cyan';
      const rawExport = [
        'TRACK — PHONE NUMBER ANALYSIS',
        `Input:               ${d.input}`,
        `Valid:               ${d.isValid ? 'Yes' : 'No'}`,
        `Possible:            ${d.isPossible ? 'Yes' : 'No'}`,
        `Country:             ${d.flag} ${d.countryName} (${d.country})`,
        `Country Code:        ${d.countryCode}`,
        `National Number:     ${d.nationalNumber}`,
        `International:       ${d.international}`,
        `National Format:     ${d.national_formatted}`,
        `E.164:               ${d.e164}`,
        `RFC3966:             ${d.rfc3966}`,
        `Number Type:         ${d.numberType}`,
        `Timezone:            ${d.timezone ?? 'Unknown'}`,
        `Local Time:          ${d.localTime ?? 'Unknown'}`,
      ].join('\n');

      setResult({
        status: d.status,
        summary: `${d.flag} ${d.international} — ${d.countryName}`,
        explanation: d.isValid
          ? `${d.numberType} number registered in ${d.countryName} (${d.countryCode}). ${d.localTime ? 'Local time there: ' + d.localTime + '.' : ''}`
          : `Number format is structurally possible but could not be validated for ${d.countryName}.`,
        rawTextForExport: rawExport,
        details: (
          <div className="space-y-6">
            {/* Core fields grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <InfoCard label="Country" value={`${d.flag} ${d.countryName}`} />
              <InfoCard label="Country Code" value={d.countryCode} mono />
              <InfoCard label="Number Type" value={d.numberType} />
              <InfoCard label="National Number" value={d.nationalNumber} mono />
              <InfoCard label="International" value={d.international} mono />
              <InfoCard label="National Format" value={d.national_formatted} mono />
              <InfoCard label="E.164" value={d.e164} mono />
              <InfoCard label="RFC3966 (URI)" value={d.rfc3966} mono />
              <InfoCard label="Valid" value={d.isValid ? '✓ Yes' : '✗ No'} />
              <InfoCard label="Possible" value={d.isPossible ? '✓ Yes' : '✗ No'} />
              {d.timezone && <InfoCard label="Timezone" value={d.timezone} />}
              {d.localTime && <InfoCard label="Local Time Now" value={d.localTime} />}
            </div>

            {/* Carrier lookup links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Carrier & Reputation Lookup (External)
              </h4>
              <p className="text-xs text-slate-400">
                Browser security prevents automated carrier lookup — click to investigate externally:
              </p>
              <div className="flex flex-wrap gap-2">
                {d.carrierLinks.map(l => (
                  <a key={l.name} href={l.url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 hover:border-cyan-500/50 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    {l.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Number risk context */}
            {d.typeRisk !== 'low' && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs">
                <strong>⚠ Caution:</strong> {d.numberType} numbers may incur higher costs or be used in phone scams. Verify before calling back.
              </div>
            )}
          </div>
        ),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ToolPage
      toolId="track"
      title="Phone Number Tracker"
      description="Decode any phone number — country, type (mobile/VoIP/toll-free), local time, carrier lookup links, and validity check. Runs entirely offline."
      actionButtonText="Analyze Number"
      onAction={handleAnalyze}
      error={error}
      result={result}
      onClear={() => { setInput(''); setResult(null); setError(null); }}
      helpLines={[
        'libphonenumber-js (the same library used by Google) parses number metadata entirely in your browser — no network request is made.',
        'Carrier and subscriber identity require a paid server-side database; external lookup links open the number in public search tools.',
        'Always include the country code starting with + (e.g. +44 7700 900000, +91 98765 43210).',
      ]}
      relatedToolIds={['ip-tracker', 'dns-recon']}
      inputElement={
        <div className="space-y-2">
          <label htmlFor="phone-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Phone Number (with country code)
          </label>
          <input id="phone-input" type="tel" value={input} onChange={e => setInput(e.target.value)}
            placeholder="e.g. +1 650 253 0000  or  +91 98765 43210"
            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-base" />
          <p className="text-xs text-slate-400">100% offline — number never leaves your device.</p>
        </div>
      }
    />
  );
}

// ── Username + Email OSINT ─────────────────────────────────────────────────────
function UsernameEmailTracker() {
  const [mode, setMode]     = useState('username'); // 'username' | 'email'
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [result, setResult] = useState(null);
  const [openCat, setOpenCat] = useState({});

  const toggleCat = key => setOpenCat(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSearch = async () => {
    setError(null);
    setResult(null);

    if (mode === 'username') {
      try {
        const links = buildUsernameLinks(input);
        // group by category
        const groups = {};
        links.forEach(l => {
          const cat = l.category || 'other';
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(l);
        });

        const rawExport = `TRACK — USERNAME OSINT\nUsername: @${input.trim()}\n\n` +
          links.map(l => `${l.name}: ${l.profileUrl}`).join('\n');

        setResult({
          status: 'info',
          summary: `${links.length} profile links generated for "@${input.trim()}"`,
          explanation: 'Click each link to verify whether this username exists on that platform. Browser security restrictions prevent automated existence checks.',
          rawTextForExport: rawExport,
          details: (
            <div className="space-y-3">
              {Object.entries(groups).map(([cat, items]) => (
                <div key={cat} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button type="button" onClick={() => toggleCat(cat)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-navy-900 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 cursor-pointer">
                    <span>{cat.charAt(0).toUpperCase() + cat.slice(1)} ({items.length})</span>
                    {openCat[cat] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {(openCat[cat] !== false) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-white dark:bg-navy-950">
                      {items.map(l => (
                        <a key={l.name} href={l.profileUrl} target="_blank" rel="noreferrer"
                          className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-navy-900 hover:border-cyan-500/50 group transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm">{l.icon}</span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors block">{l.name}</span>
                              <span className="text-[10px] font-mono text-slate-400 truncate block">/{input.trim()}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-cyan-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ),
        });
      } catch (err) {
        setError(err.message);
      }

    } else {
      // Email mode
      setLoading(true);
      try {
        const d = await analyzeEmail(input);

        const rawExport = `TRACK — EMAIL OSINT\nEmail: ${d.email}\nDomain: ${d.domain}\nLocal Part: ${d.localPart}\nDomain Type: ${d.domainType}\nMX Records: ${d.hasMx ? d.mxRecords.join(', ') : 'None found'}\nDisposable: ${d.isDisposable ? 'Yes' : 'No'}`;

        setResult({
          status: d.status,
          summary: d.isDisposable
            ? `⚠ Disposable email address detected — ${d.email}`
            : d.hasMx
              ? `${d.email} — Domain has valid mail server`
              : `${d.email} — Domain has no MX records`,
          explanation: d.isDisposable
            ? `"${d.domain}" is a known temporary/disposable email provider. These are often used to bypass registration checks and are commonly linked to abuse.`
            : d.hasMx
              ? `"${d.domain}" is a ${d.domainType.toLowerCase()} with active mail servers. Use the investigation links below to check breach databases, reputation services, and social footprint.`
              : `No MX records found for "${d.domain}". This domain may not be a real mail server, or records may be hidden.`,
          rawTextForExport: rawExport,
          details: (
            <div className="space-y-6">
              {/* Email metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoCard label="Email"       value={d.email}      mono />
                <InfoCard label="Local Part"  value={d.localPart}  mono />
                <InfoCard label="Domain"      value={d.domain}     mono />
                <InfoCard label="Domain Type" value={d.domainType} />
                <InfoCard label="MX Records"  value={d.hasMx ? `${d.mxRecords.length} found` : 'None'} />
                <InfoCard label="Disposable"  value={d.isDisposable ? '⚠ Yes' : '✓ No'} />
              </div>

              {/* MX records */}
              {d.hasMx && (
                <div className="p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">MX Records</span>
                  {d.mxRecords.map((r, i) => (
                    <div key={i} className="font-mono text-xs text-slate-800 dark:text-slate-200 py-0.5">{r}</div>
                  ))}
                </div>
              )}

              {/* Investigation link groups */}
              {d.investigationLinks.map(group => (
                <div key={group.category} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{group.category}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.items.map(item => (
                      <a key={item.name} href={item.url} target="_blank" rel="noreferrer"
                        className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 hover:border-cyan-500/50 group transition-colors">
                        <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors block">{item.name}</span>
                          <span className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-cyan-400 shrink-0 mt-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              {/* Domain links if custom domain */}
              {d.domainLinks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Domain Intelligence</h4>
                  <div className="flex flex-wrap gap-2">
                    {d.domainLinks.map(l => (
                      <a key={l.name} href={l.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 hover:border-cyan-500/50 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 transition-colors">
                        <span>{l.icon}</span> {l.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Social platforms using local part as username */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Social Platforms — Searching Username "<span className="text-cyan-500">{d.localPart}</span>"
                </h4>
                <p className="text-xs text-slate-400">These links assume the email local part is also used as a username on each platform.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {d.socialFromLocal.slice(0, 12).map(l => (
                    <a key={l.name} href={l.profileUrl} target="_blank" rel="noreferrer"
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-navy-900 hover:border-cyan-500/50 group transition-colors">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm">{l.icon}</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors truncate">{l.name}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-cyan-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ToolPage
      toolId="track"
      title="Username & Email OSINT"
      description="Search a username across 30 social platforms, or investigate an email address — domain validity, breach databases, reputation services, and social footprint."
      actionButtonText={mode === 'username' ? 'Search Username' : loading ? 'Investigating…' : 'Investigate Email'}
      onAction={handleSearch}
      loading={loading}
      error={error}
      result={result}
      onClear={() => { setInput(''); setResult(null); setError(null); }}
      helpLines={
        mode === 'username'
          ? [
              'Platforms are grouped by category — Social, Developer, Creative, Gaming, and Professional.',
              'Each link opens the profile URL for the given username. You must visit the page to confirm the account exists.',
              'Browser security (CORS) prevents automated HTTP probing of third-party sites from client-side JavaScript.',
            ]
          : [
              'Email domain MX records are checked via Cloudflare DNS-over-HTTPS — no data is sent to Nexus servers.',
              'Breach database links (HIBP, DeHashed) open externally and may require their own accounts for full results.',
              'The social platform search uses the local part (before @) as the target username.',
            ]
      }
      relatedToolIds={['dns-recon', 'password-auditor', 'ip-tracker']}
      inputElement={
        <div className="space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            <button type="button" onClick={() => { setMode('username'); setInput(''); setResult(null); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'username'
                  ? 'bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
              <User className="w-3.5 h-3.5" /> Username Search
            </button>
            <button type="button" onClick={() => { setMode('email'); setInput(''); setResult(null); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'email'
                  ? 'bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
              <Mail className="w-3.5 h-3.5" /> Email OSINT
            </button>
          </div>

          {mode === 'username' ? (
            <div className="space-y-1.5">
              <label htmlFor="username-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username / Handle</label>
              <input id="username-input" type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="e.g. elonmusk  or  john_doe"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-base" />
              <p className="text-xs text-slate-400">Generates 30 clickable profile links grouped by category.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input id="email-input" type="email" value={input} onChange={e => setInput(e.target.value)}
                placeholder="e.g. target@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-base" />
              <p className="text-xs text-slate-400">Checks domain MX records locally, then provides curated investigation links for breach databases, reputation tools, and social platforms.</p>
            </div>
          )}
        </div>
      }
    />
  );
}

// ── Main Track page — tab router ───────────────────────────────────────────────
export default function Track() {
  const [tab, setTab] = useState('phone');

  return (
    <div>
      {/* Top tab switcher */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  tab === t.id
                    ? 'bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-400 shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'phone'    && <PhoneTracker />}
      {tab === 'username' && <UsernameEmailTracker />}
    </div>
  );
}
