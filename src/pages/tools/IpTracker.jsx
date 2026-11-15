import React, { useState } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { lookupIp, isValidIp } from '../../utils/ip';
import { TOOLS } from '../../data/toolsData';
import { Globe, MapPin, Radio, ShieldAlert } from 'lucide-react';

export default function IpTracker() {
  const toolMeta = TOOLS.find(t => t.id === 'ip-tracker');
  const [ipInput, setIpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleLookup = async (overrideIp = null) => {
    const targetIp = (overrideIp !== null ? overrideIp : ipInput).trim();
    setError(null);

    // Validate before request if an IP was entered
    if (targetIp) {
      const validation = isValidIp(targetIp);
      if (!validation.valid) {
        setError(`"${targetIp}" does not look like a valid IPv4 or IPv6 address. Example: 8.8.8.8 or 1.1.1.1`);
        return;
      }
    }

    setLoading(true);
    try {
      const data = await lookupIp(targetIp);
      
      const isProxyOrHosting = data.isVpnHint || data.isHosting;
      const status = isProxyOrHosting ? 'warning' : 'safe';

      const summary = `${data.city}, ${data.country} (${data.ip})`;
      const explanation = isProxyOrHosting
        ? `This IP belongs to ${data.isp}. It appears to be associated with cloud hosting, a datacenter, or VPN/proxy infrastructure.`
        : `This IP is routed via ${data.isp} in ${data.city}, ${data.region}, ${data.country}. Normal residential or enterprise routing detected.`;

      const rawExport = `NEXUS IP TRACKER REPORT
IP Address: ${data.ip} (${data.version})
Location: ${data.city}, ${data.region}, ${data.country} (${data.countryCode})
Coordinates: ${data.latitude}, ${data.longitude}
Timezone: ${data.timezone}
ISP / ASN: ${data.isp} (${data.asn})
Hosting / VPN Hint: ${isProxyOrHosting ? 'Yes' : 'No'}
Timestamp: ${new Date().toISOString()}`;

      setResult({
        status,
        summary,
        explanation,
        rawTextForExport: rawExport,
        details: (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">IP Address</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{data.ip}</span>
                <span className="text-xs text-cyan-600 block mt-0.5">{data.version}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Location</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{data.city}, {data.region}</span>
                <span className="text-xs text-slate-500 block mt-0.5">{data.country} ({data.countryCode})</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">ISP / Network</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{data.isp}</span>
                <span className="text-xs text-slate-500 block mt-0.5">ASN: {data.asn}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Coordinates</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {data.latitude ?? 'N/A'}, {data.longitude ?? 'N/A'}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">Postal: {data.postal}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Timezone</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{data.timezone}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Hosting / Datacenter</span>
                <span className={`text-sm font-bold ${isProxyOrHosting ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {isProxyOrHosting ? 'Datacenter / Proxy Hint' : 'Residential / Standard'}
                </span>
              </div>
            </div>

            {/* Simple Map Pin Representation */}
            {data.latitude && data.longitude && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-navy-900 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    Approximate Geolocation Center
                  </span>
                  <a 
                    href={`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}#map=12/${data.latitude}/${data.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    View on OpenStreetMap →
                  </a>
                </div>
                <div className="h-32 sm:h-40 rounded-lg bg-slate-100 dark:bg-navy-950 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="relative z-10 flex flex-col items-center text-center p-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center animate-bounce">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">
                      {data.city}, {data.country}
                    </p>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      Lat: {data.latitude}° | Lon: {data.longitude}°
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      });
    } catch (err) {
      setError(err.message || 'Lookup failed. Please check the IP address or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyIp = () => {
    setIpInput('');
    handleLookup('');
  };

  return (
    <ToolPage
      toolId="ip-tracker"
      title="IP Tracker & Geolocation"
      description="Inspect any IPv4 or IPv6 address to pinpoint its geographic origin, ISP, and network characteristics."
      actionButtonText="Track IP"
      onAction={() => handleLookup()}
      loading={loading}
      error={error}
      result={result}
      onClear={() => {
        setIpInput('');
        setResult(null);
        setError(null);
      }}
      helpLines={toolMeta?.helpText || []}
      relatedToolIds={toolMeta?.related || []}
      inputElement={
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="ip-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              IP Address
            </label>
            <button
              type="button"
              onClick={handleUseMyIp}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Use my IP</span>
            </button>
          </div>
          <div className="relative">
            <input
              id="ip-input"
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 8.8.8.8 or 2001:4860:4860::8888"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-base transition-colors"
            />
          </div>
        </div>
      }
    />
  );
}
