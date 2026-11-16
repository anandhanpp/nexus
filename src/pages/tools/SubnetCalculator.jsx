import React, { useState } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { parseSubnet } from '../../utils/subnet';
import { TOOLS } from '../../data/toolsData';

export default function SubnetCalculator() {
  const toolMeta = TOOLS.find(t => t.id === 'subnet-calculator');
  const [inputVal, setInputVal] = useState('192.168.1.0/24');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleCalculate = (override = null) => {
    const raw = (override !== null ? override : inputVal).trim();
    setError(null);

    if (!raw) {
      setError('Please specify an IP with CIDR (e.g. 10.0.0.0/16 or 192.168.1.0/24)');
      return;
    }

    try {
      const data = parseSubnet(raw);
      
      const summary = `${data.networkAddress}/${data.cidr} • ${data.usableHosts} Usable Allocations`;
      const explanation = `Provides ${data.usableHosts} usable host IPs spanning ${data.firstHost} through ${data.lastHost}. Network ID is ${data.networkAddress}, broadcast address is ${data.broadcastAddress} (${data.isPrivate ? 'RFC 1918 Private Range' : 'Public Internet Space'}).`;

      const rawExport = `NEXUS SUBNET CALCULATOR TELEMETRY
Target: ${data.ip}
CIDR Prefix: /${data.cidr}
Subnet Mask: ${data.subnetMask}
Wildcard Mask: ${data.wildcardMask}
Network ID: ${data.networkAddress}
Broadcast ID: ${data.broadcastAddress}
Usable Host Scope: ${data.firstHost} - ${data.lastHost}
Total Addresses: ${data.totalHosts}
Usable Hosts: ${data.usableHosts}
Class: Class ${data.ipClass}
Scope: ${data.isPrivate ? 'Private' : 'Public'}
Binary IP:        ${data.binary.ip}
Binary Mask:      ${data.binary.mask}
Binary Network:   ${data.binary.network}
Binary Broadcast: ${data.binary.broadcast}
Timestamp: ${new Date().toISOString()}`;

      setResult({
        status: 'safe',
        summary,
        explanation,
        rawTextForExport: rawExport,
        details: (
          <div className="space-y-4">
            {/* Core Subnet Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Subnet Mask</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{data.subnetMask}</span>
                <span className="text-[10px] font-mono text-emerald-500">/{data.cidr}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Wildcard Mask</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{data.wildcardMask}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Usable Host Range</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {data.firstHost} – {data.lastHost}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Network Identifier</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{data.networkAddress}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Broadcast Address</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{data.broadcastAddress}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Allocation Scope</span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block mt-0.5">Class {data.ipClass}</span>
                <span className="text-[10px] font-mono text-slate-500">{data.isPrivate ? 'RFC 1918 Private' : 'Public Internet'}</span>
              </div>
            </div>

            {/* Binary Bit-Level View */}
            <div className="p-4 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                32-BIT BINARY OCTET DISTRIBUTION
              </span>
              <div className="font-mono text-xs space-y-1.5 overflow-x-auto">
                <div className="flex items-center gap-4 py-1 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="w-24 text-slate-400">IP BINARY:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{data.binary.ip}</span>
                </div>
                <div className="flex items-center gap-4 py-1 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="w-24 text-slate-400">NETMASK:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{data.binary.mask}</span>
                </div>
                <div className="flex items-center gap-4 py-1 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="w-24 text-slate-400">NETWORK:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{data.binary.network}</span>
                </div>
                <div className="flex items-center gap-4 py-1">
                  <span className="w-24 text-slate-400">BROADCAST:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{data.binary.broadcast}</span>
                </div>
              </div>
            </div>
          </div>
        )
      });
    } catch (err) {
      setError(err.message || 'Invalid CIDR format. Example: 192.168.1.0/24');
    }
  };

  const handleExample = (preset) => {
    setInputVal(preset);
    handleCalculate(preset);
  };

  return (
    <ToolPage
      toolId="subnet-calculator"
      title="Subnet Calculator & CIDR Planner"
      description="Calculate broadcast boundaries, first/last usable IP allocations, wildcard masks, and binary distribution completely offline."
      actionButtonText="CALCULATE CIDR"
      onAction={() => handleCalculate()}
      error={error}
      result={result}
      onClear={() => {
        setInputVal('');
        setResult(null);
        setError(null);
      }}
      helpLines={toolMeta?.helpText || []}
      relatedToolIds={toolMeta?.related || []}
      inputElement={
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="subnet-input" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              IP & CIDR PREFIX OR MASK
            </label>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>PRESETS:</span>
              <button 
                type="button" 
                onClick={() => handleExample('192.168.1.0/24')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                /24 Home
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleExample('10.0.0.0/16')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                /16 Corp
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleExample('172.16.0.0/12')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                /12 Cloud
              </button>
            </div>
          </div>
          <input
            id="subnet-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. 192.168.1.0/24 or 10.0.0.1 255.255.0.0"
            className="w-full px-3.5 py-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
          />
        </div>
      }
    />
  );
}
