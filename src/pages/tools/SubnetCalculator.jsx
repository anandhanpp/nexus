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
      setError('Please enter an IP address with CIDR (e.g., 10.0.0.0/16 or 192.168.1.0/24)');
      return;
    }

    try {
      const data = parseSubnet(raw);
      
      const summary = `${data.networkAddress}/${data.cidr} • ${data.usableHosts} Usable Hosts`;
      const explanation = `This subnet provides ${data.usableHosts} usable host addresses from ${data.firstHost} to ${data.lastHost}. Network address is ${data.networkAddress} and broadcast is ${data.broadcastAddress}. (${data.isPrivate ? 'RFC 1918 Private IP Range' : 'Public IP Range'})`;

      const rawExport = `NEXUS SUBNET CALCULATOR REPORT
IP Address: ${data.ip}
CIDR Prefix: /${data.cidr}
Subnet Mask: ${data.subnetMask}
Wildcard Mask: ${data.wildcardMask}
Network Address: ${data.networkAddress}
Broadcast Address: ${data.broadcastAddress}
Usable Host Range: ${data.firstHost} - ${data.lastHost}
Total Addresses: ${data.totalHosts}
Usable Hosts: ${data.usableHosts}
IP Class: ${data.ipClass}
Scope: ${data.isPrivate ? 'Private' : 'Public'}
Binary IP:   ${data.binary.ip}
Binary Mask: ${data.binary.mask}
Binary Net:  ${data.binary.network}
Binary Bcast:${data.binary.broadcast}
Timestamp: ${new Date().toISOString()}`;

      setResult({
        status: 'safe',
        summary,
        explanation,
        rawTextForExport: rawExport,
        details: (
          <div className="space-y-6">
            {/* Core Subnet Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Subnet Mask</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{data.subnetMask}</span>
                <span className="text-xs text-cyan-600 block mt-0.5">/{data.cidr}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Wildcard Mask</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{data.wildcardMask}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Usable Host Range</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {data.firstHost} – {data.lastHost}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Network ID</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{data.networkAddress}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Broadcast Address</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{data.broadcastAddress}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Classification & Scope</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Class {data.ipClass}</span>
                <span className="text-xs text-slate-500 block mt-0.5">{data.isPrivate ? 'RFC 1918 Private' : 'Public Internet'}</span>
              </div>
            </div>

            {/* Binary Bit-Level View */}
            <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                32-Bit Binary Representation
              </h4>
              <div className="font-mono text-xs space-y-2 overflow-x-auto">
                <div className="flex items-center gap-4 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-20 text-slate-400">IP:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{data.binary.ip}</span>
                </div>
                <div className="flex items-center gap-4 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-20 text-slate-400">Mask:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{data.binary.mask}</span>
                </div>
                <div className="flex items-center gap-4 py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-20 text-slate-400">Network:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{data.binary.network}</span>
                </div>
                <div className="flex items-center gap-4 py-1">
                  <span className="w-20 text-slate-400">Broadcast:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{data.binary.broadcast}</span>
                </div>
              </div>
            </div>
          </div>
        )
      });
    } catch (err) {
      setError(err.message || 'Invalid subnet syntax. Example: 192.168.1.0/24');
    }
  };

  const handleExample = (preset) => {
    setInputVal(preset);
    handleCalculate(preset);
  };

  return (
    <ToolPage
      toolId="subnet-calculator"
      title="Subnet Calculator & CIDR Range Planner"
      description="Calculate broadcast boundaries, first and last usable host IPs, wildcard masks, and binary bit allocation instantly offline."
      actionButtonText="Calculate Subnet"
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
            <label htmlFor="subnet-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              IP & CIDR or Subnet Mask
            </label>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Presets:</span>
              <button 
                type="button" 
                onClick={() => handleExample('192.168.1.0/24')}
                className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                /24 (Home/Office)
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleExample('10.0.0.0/16')}
                className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                /16 (Corporate)
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleExample('172.16.0.0/12')}
                className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                /12 (Cloud VPC)
              </button>
            </div>
          </div>
          <input
            id="subnet-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. 192.168.1.0/24 or 10.0.0.1 255.255.0.0"
            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-base transition-colors"
          />
        </div>
      }
    />
  );
}
