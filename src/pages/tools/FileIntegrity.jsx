import React, { useState, useEffect } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { hashFile, formatFileSize, getFileBaselines, saveFileBaseline, removeFileBaseline } from '../../utils/fileHash';
import { TOOLS } from '../../data/toolsData';
import { 
  UploadCloud, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  Trash2, 
  Lock,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function FileIntegrity() {
  const toolMeta = TOOLS.find(t => t.id === 'file-integrity');
  const [selectedFile, setSelectedFile] = useState(null);
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [expectedHash, setExpectedHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [computedHash, setComputedHash] = useState('');
  const [baselines, setBaselines] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setBaselines(getFileBaselines());
  }, []);

  const handleFile = async (file, algo = algorithm) => {
    if (!file) return;
    setSelectedFile(file);
    setError(null);
    setLoading(true);
    setProgress(10);

    try {
      const hash = await hashFile(file, algo, (p) => setProgress(p));
      setComputedHash(hash);
    } catch (err) {
      setError(err.message || 'Failed to hash file');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const cleanExpected = expectedHash.trim().toLowerCase();
  const cleanComputed = computedHash.trim().toLowerCase();
  const hasExpected = cleanExpected.length > 0;
  const isMatch = hasExpected && cleanExpected === cleanComputed;

  const existingBaseline = selectedFile ? baselines.find(b => b.name === selectedFile.name) : null;
  const baselineChanged = existingBaseline && existingBaseline.hash !== computedHash;

  const handleSaveBaseline = () => {
    if (!selectedFile || !computedHash) return;
    const record = {
      name: selectedFile.name,
      size: formatFileSize(selectedFile.size),
      algorithm,
      hash: computedHash,
      date: new Date().toLocaleDateString()
    };
    const updated = saveFileBaseline(record);
    setBaselines(updated);
  };

  const handleDeleteBaseline = (name) => {
    const updated = removeFileBaseline(name);
    setBaselines(updated);
  };

  let status = 'safe';
  let summary = '';
  let explanation = '';

  if (computedHash) {
    if (hasExpected) {
      if (isMatch) {
        status = 'safe';
        summary = 'CHECKSUM MATCH // INTEGRITY VERIFIED';
        explanation = `The calculated ${algorithm} digest exactly matches the official expected hash. File byte sequence is verified as authentic and untampered.`;
      } else {
        status = 'danger';
        summary = 'CHECKSUM MISMATCH // INTEGRITY COMPROMISED';
        explanation = `Warning: The calculated ${algorithm} digest does NOT match the expected value. The file has been altered, corrupted, or replaced in transit.`;
      }
    } else if (existingBaseline) {
      if (baselineChanged) {
        status = 'danger';
        summary = 'BASELINE ALERT // FILE MODIFIED';
        explanation = `The checksum differs from the previously saved baseline. Byte alterations detected since initial registration.`;
      } else {
        status = 'safe';
        summary = 'BASELINE CONFIRMED // UNALTERED';
        explanation = `The file digest matches your saved local baseline record. No modifications detected.`;
      }
    } else {
      status = 'info';
      summary = `${algorithm} CHECKSUM READY • ${selectedFile?.name}`;
      explanation = `Computed cryptographic fingerprint for ${selectedFile?.name} (${formatFileSize(selectedFile?.size || 0)}). Processed purely in browser memory heap without server transmission.`;
    }
  }

  const rawExport = computedHash ? `NEXUS FILE INTEGRITY REPORT
File: ${selectedFile?.name}
Size: ${formatFileSize(selectedFile?.size || 0)} (${selectedFile?.size} bytes)
Algorithm: ${algorithm}
Digest: ${computedHash}
Expected: ${expectedHash || 'None'}
Verification: ${hasExpected ? (isMatch ? 'MATCH' : 'MISMATCH') : 'N/A'}
Timestamp: ${new Date().toISOString()}` : '';

  const resultData = computedHash ? {
    status,
    summary,
    explanation,
    rawTextForExport: rawExport,
    details: (
      <div className="space-y-4">
        {/* File Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">File Name</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block mt-0.5">{selectedFile?.name}</span>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Byte Size</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{formatFileSize(selectedFile?.size || 0)}</span>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Algorithm</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{algorithm}</span>
          </div>
        </div>

        {/* Full Hash Output */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              COMPUTED {algorithm} CHECKSUM
            </span>
            <button
              type="button"
              onClick={handleSaveBaseline}
              className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>SAVE TO BASELINES</span>
            </button>
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-carbon-950 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 break-all select-all">
            {computedHash}
          </div>
        </div>

        {/* Saved Baselines List */}
        {baselines.length > 0 && (
          <div className="p-3.5 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              LOCAL FILE BASELINES ({baselines.length})
            </span>
            <div className="space-y-1.5">
              {baselines.map((b) => (
                <div key={b.name} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-carbon-950 text-xs font-mono">
                  <div className="space-y-0.5 truncate pr-2">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">{b.name}</span>
                    <span className="text-slate-400 text-[10px] block truncate">{b.hash}</span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-slate-500 text-[10px]">{b.size}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBaseline(b.name)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  } : null;

  return (
    <ToolPage
      toolId="file-integrity"
      title="File Integrity & Checksum Verifier"
      description="Compute cryptographic checksums (SHA-256 / SHA-512) directly in your browser, verify vendor hashes, and track local file baselines."
      actionButtonText={loading ? 'COMPUTING HASH...' : 'VERIFY FILE'}
      onAction={null}
      error={error}
      result={resultData}
      onClear={() => {
        setSelectedFile(null);
        setComputedHash('');
        setExpectedHash('');
        setError(null);
      }}
      helpLines={toolMeta?.helpText || []}
      relatedToolIds={toolMeta?.related || []}
      inputElement={
        <div className="space-y-3 font-mono">
          {/* Algorithm Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="hash-algo-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ALGORITHM:
              </label>
              <select
                id="hash-algo-select"
                value={algorithm}
                onChange={(e) => {
                  const newAlgo = e.target.value;
                  setAlgorithm(newAlgo);
                  if (selectedFile) handleFile(selectedFile, newAlgo);
                }}
                className="px-2 py-1 rounded border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="SHA-256">SHA-256 (Industry Standard)</option>
                <option value="SHA-512">SHA-512 (Extended)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Lock className="w-3 h-3" />
              <span>100% IN-MEMORY HASHING</span>
            </div>
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-lg border-2 border-dashed p-6 text-center transition-all ${
              dragOver 
                ? 'border-emerald-500 bg-emerald-500/10' 
                : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 hover:border-emerald-500/50'
            }`}
          >
            <input
              id="file-input"
              type="file"
              onChange={handleFileInput}
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer space-y-2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-carbon-800 border border-slate-200 dark:border-slate-700 text-emerald-500 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {selectedFile ? selectedFile.name : 'Drop file here, or click to browse local files'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedFile ? `${formatFileSize(selectedFile.size)} • Click to choose different file` : 'Files are processed in memory and never transmitted over the network.'}
                </p>
              </div>
            </label>
          </div>

          {/* Optional Compare Mode Input */}
          <div>
            <label htmlFor="expected-hash" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              COMPARE WITH EXPECTED HASH (OPTIONAL):
            </label>
            <input
              id="expected-hash"
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste official vendor checksum to compare..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
            />
          </div>
        </div>
      }
    />
  );
}
