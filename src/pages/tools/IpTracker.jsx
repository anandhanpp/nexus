import React, { useState } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { lookupIp, isValidIp } from '../../utils/ip';
import { TOOLS } from '../../data/toolsData';
import { Globe, MapPin, Radio, ExternalLink } from 'lucide-react';

export default function IpTracker() {
  const toolMeta = TOOLS.find(t => t.id === 'ip-tracker');
  const [ipInput, setIpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleLookup = async (overrideIp = null) => {
    const targetIp = (overrideIp !== null ? overrideIp : ipInput).trim();
    setError(null);

    if (targetIp) {
      const validation = isValidIp(targetIp);
      if (!validation.valid) {
        setError(`"${targetIp}" is not a recognized IPv4 or IPv6 address. Examples: 8.8.8.8, 1.1.1.1`);
        return;
      }
    }

    setLoading(true);
    try {
      const data = await lookupIp(targetIp);
      
      const isProxyOrHosting = data.isVpnHint || data.isHosting;
      const status = isProxyOrHosting ? 'warning' : 'safe';

      const summary = `${data.city}, ${data.country} • ${data.ip}`;
      const explanation = isProxyOrHosting
        ? `Routed via ${data.isp} (ASN: ${data.asn}). Infrastructure pattern indicates datacenter hosting, cloud compute, or proxy/VPN transit.`
        : `Routed via ${data.isp} in ${data.city}, ${data.region}, ${data.country}. Standard ISP residential/commercial routing detected.`;

      const rawExport = `NEXUS IP TRACKER TELEMETRY REPORT
IP Address: ${data.ip} (${data.version})
Location: ${data.city}, ${data.region}, ${data.country} (${data.countryCode})
Coordinates: Lat ${data.latitude}, Lon ${data.longitude}
Timezone: ${data.timezone}
ISP / Org: ${data.isp}
ASN: ${data.asn}
Datacenter / Proxy Flag: ${isProxyOrHosting ? 'True' : 'False'}
Timestamp: ${new Date().toISOString()}`;

      setResult({
        status,
        summary,
        explanation,
        rawTextForExport: rawExport,
        details: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Target IP & Family</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{data.ip}</span>
                <span className="text-[11px] font-mono text-emerald-500">{data.version}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Geographic Region</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{data.city}, {data.region}</span>
                <span className="text-[11px] text-slate-500 font-mono">{data.country} ({data.countryCode})</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Autonomous System (ASN)</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block mt-0.5">{data.isp}</span>
                <span className="text-[11px] font-mono text-slate-500">ASN: {data.asn}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Coordinates & Postal</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {data.latitude ?? 'N/A'}, {data.longitude ?? 'N/A'}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Postal: {data.postal}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Timezone</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{data.timezone}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Infrastructure Classification</span>
                <span className={`text-xs font-mono font-bold block mt-0.5 ${isProxyOrHosting ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {isProxyOrHosting ? 'DATACENTER / VPN TRANSIT' : 'RESIDENTIAL / ENDPOINT'}
                </span>
              </div>
            </div>

            {data.latitude && data.longitude && (
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-carbon-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    BGP Geolocation Center: {data.city}, {data.country} ({data.latitude}°, {data.longitude}°)
                  </span>
                </div>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}#map=12/${data.latitude}/${data.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>OpenStreetMap</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )
      });
    } catch (err) {
      setError(err.message || 'IP lookup failed. Please verify the address.');
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
      description="Inspect IPv4 or IPv6 endpoints to extract geographic location, ISP routing ownership, and autonomous system classification."
      actionButtonText="TRACK IP"
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
            <label htmlFor="ip-input" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              TARGET IP ADDRESS
            </label>
            <button
              type="button"
              onClick={handleUseMyIp}
              className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Radio className="w-3 h-3" />
              <span>[ AUTO-FILL CLIENT IP ]</span>
            </button>
          </div>
          <input
            id="ip-input"
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="e.g. 8.8.8.8 or 2001:4860:4860::8888"
            className="w-full px-3.5 py-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
          />
        </div>
      }
    />
  );
}
