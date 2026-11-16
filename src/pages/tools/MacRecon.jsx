import React, { useState } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { analyzeMacAddress } from '../../utils/mac';
import { TOOLS } from '../../data/toolsData';

export default function MacRecon() {
  const toolMeta = TOOLS.find(t => t.id === 'mac-recon');
  const [macInput, setMacInput] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    setError(null);
    try {
      const data = analyzeMacAddress(macInput);
      
      const summary = `${data.vendor} • ${data.formattedMac}`;
      const rawExport = `NEXUS MAC RECON REPORT
Input: ${data.input}
Formatted MAC: ${data.formattedMac}
OUI Prefix: ${data.oui}
Vendor: ${data.vendor}
Transmission: ${data.castType}
Administration: ${data.adminType}
Randomized Device MAC: ${data.isLocal ? 'Yes' : 'No'}
Timestamp: ${new Date().toISOString()}`;

      setResult({
        status: data.isLocal ? 'warning' : 'safe',
        summary,
        explanation: data.explanation,
        rawTextForExport: rawExport,
        details: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Normalized MAC</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{data.formattedMac}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">OUI Prefix (IEEE ID)</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{data.oui}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Hardware Vendor</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block mt-0.5">{data.vendor}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Transmission Mode</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white block mt-0.5">{data.castType}</span>
                <span className="text-[10px] font-mono text-slate-500">I/G Bit: {data.isMulticast ? '1 (Group)' : '0 (Individual)'}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Administration Bit</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white block mt-0.5">{data.adminType.split(' ')[0]}</span>
                <span className="text-[10px] font-mono text-slate-500">U/L Bit: {data.isLocal ? '1 (Local Admin)' : '0 (Global)'}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Privacy Randomization</span>
                <span className={`text-xs font-mono font-bold block mt-0.5 ${data.isLocal ? 'text-amber-500' : 'text-slate-400'}`}>
                  {data.isLocal ? 'ACTIVE (OS RANDOMIZED)' : 'INACTIVE (BURNED-IN)'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-100/60 dark:bg-carbon-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">// PRIVACY MAC BIT NOTE:</span>
              iOS, Android 10+, and Windows 10/11 randomize MAC addresses across Wi-Fi networks by setting the Universally/Locally Administered (U/L) bit to 1. If this bit is set, the hardware manufacturer cannot be matched against the standard IEEE OUI directory.
            </div>
          </div>
        )
      });
    } catch (err) {
      setError(err.message || 'Invalid MAC format. Please check characters.');
    }
  };

  const handleExample = (exampleMac) => {
    setMacInput(exampleMac);
    try {
      const data = analyzeMacAddress(exampleMac);
      setResult({
        status: data.isLocal ? 'warning' : 'safe',
        summary: `${data.vendor} • ${data.formattedMac}`,
        explanation: data.explanation,
        rawTextForExport: `Normalized: ${data.formattedMac}\nVendor: ${data.vendor}`
      });
    } catch {}
  };

  return (
    <ToolPage
      toolId="mac-recon"
      title="MAC Reconnaissance & OUI Lookup"
      description="Identify hardware vendors, unicast/multicast bit designations, and detect OS Wi-Fi privacy MAC randomization."
      actionButtonText="ANALYZE MAC"
      onAction={handleAnalyze}
      error={error}
      result={result}
      onClear={() => {
        setMacInput('');
        setResult(null);
        setError(null);
      }}
      helpLines={toolMeta?.helpText || []}
      relatedToolIds={toolMeta?.related || []}
      inputElement={
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="mac-input" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              HARDWARE MAC ADDRESS
            </label>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>TEST:</span>
              <button 
                type="button" 
                onClick={() => handleExample('B8:27:EB:12:34:56')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Raspberry Pi
              </button>
              <span>•</span>
              <button 
                type="button" 
                onClick={() => handleExample('00:0C:29:AB:CD:EF')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                VMware
              </button>
            </div>
          </div>
          <input
            id="mac-input"
            type="text"
            value={macInput}
            onChange={(e) => setMacInput(e.target.value)}
            placeholder="e.g. 00:1A:2B:3C:4D:5E or 001A.2B3C.4D5E"
            className="w-full px-3.5 py-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
          />
        </div>
      }
    />
  );
}
