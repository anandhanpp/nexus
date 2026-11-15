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
  RefreshCw
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
      setError(err.message || 'Failed to calculate file hash');
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

  // Compare mode logic
  const cleanExpected = expectedHash.trim().toLowerCase();
  const cleanComputed = computedHash.trim().toLowerCase();
  const hasExpected = cleanExpected.length > 0;
  const isMatch = hasExpected && cleanExpected === cleanComputed;

  // Baseline check logic
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

  // Build result summary
  let status = 'safe';
  let summary = '';
  let explanation = '';

  if (computedHash) {
    if (hasExpected) {
      if (isMatch) {
        status = 'safe';
        summary = 'Cryptographic Match: Checksum Verified!';
        explanation = `The calculated ${algorithm} checksum perfectly matches the expected hash. The file is authentic and has not been altered or corrupted in transit.`;
      } else {
        status = 'danger';
        summary = 'Checksum Mismatch: Hash Does NOT Match!';
        explanation = `Warning: The calculated ${algorithm} hash does not match the expected hash. This indicates the file may have been modified, corrupted, or tampered with.`;
      }
    } else if (existingBaseline) {
      if (baselineChanged) {
        status = 'danger';
        summary = 'Baseline Alert: File Has Been Modified!';
        explanation = `This file was previously recorded with a different checksum. Changes or modifications have occurred since baseline recording.`;
      } else {
        status = 'safe';
        summary = 'Baseline Confirmed: File Unchanged';
        explanation = `The file checksum matches your saved browser baseline. No modifications detected.`;
      }
    } else {
      status = 'info';
      summary = `${algorithm} Hash Generated • ${selectedFile?.name}`;
      explanation = `Calculated cryptographic fingerprint for ${selectedFile?.name} (${formatFileSize(selectedFile?.size || 0)}). Purely computed in browser memory; file was never transmitted.`;
    }
  }

  const rawExport = computedHash ? `NEXUS FILE INTEGRITY REPORT
File Name: ${selectedFile?.name}
File Size: ${formatFileSize(selectedFile?.size || 0)} (${selectedFile?.size} bytes)
Algorithm: ${algorithm}
Calculated Hash: ${computedHash}
Expected Hash: ${expectedHash || 'None provided'}
Match Result: ${hasExpected ? (isMatch ? 'MATCH' : 'MISMATCH') : 'N/A'}
Timestamp: ${new Date().toISOString()}` : '';

  const resultData = computedHash ? {
    status,
    summary,
    explanation,
    rawTextForExport: rawExport,
    details: (
      <div className="space-y-6">
        {/* File Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block uppercase font-semibold">File Name</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">{selectedFile?.name}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block uppercase font-semibold">File Size</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{formatFileSize(selectedFile?.size || 0)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 block uppercase font-semibold">Algorithm</span>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{algorithm}</span>
          </div>
        </div>

        {/* Full Hash Output */}
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Computed {algorithm} Fingerprint
            </span>
            <button
              type="button"
              onClick={handleSaveBaseline}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center gap-1 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save to Integrity Baselines</span>
            </button>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-950 font-mono text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 break-all select-all">
            {computedHash}
          </div>
        </div>

        {/* Saved Baselines List */}
        {baselines.length > 0 && (
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Local File Baselines ({baselines.length})
            </h4>
            <div className="space-y-2">
              {baselines.map((b) => (
                <div key={b.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 text-xs">
                  <div className="space-y-0.5 truncate pr-2">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">{b.name}</span>
                    <span className="text-slate-400 font-mono text-[11px] block truncate">{b.hash}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-500 text-[11px]">{b.size}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBaseline(b.name)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
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
      title="File Integrity Monitor & Checksum Verifier"
      description="Compute cryptographic checksums (SHA-256 / SHA-512) directly in your browser, verify vendor hashes, and track local baselines."
      actionButtonText={loading ? 'Hashing File...' : 'Verify File'}
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
        <div className="space-y-4">
          {/* Algorithm Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="hash-algo-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Algorithm:
              </label>
              <select
                id="hash-algo-select"
                value={algorithm}
                onChange={(e) => {
                  const newAlgo = e.target.value;
                  setAlgorithm(newAlgo);
                  if (selectedFile) handleFile(selectedFile, newAlgo);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="SHA-256">SHA-256 (Industry Standard)</option>
                <option value="SHA-512">SHA-512 (Extended)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>100% Client-Side Hashing</span>
            </div>
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              dragOver 
                ? 'border-cyan-500 bg-cyan-500/10' 
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 hover:border-cyan-500/50'
            }`}
          >
            <input
              id="file-input"
              type="file"
              onChange={handleFileInput}
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedFile ? selectedFile.name : 'Drag and drop any file here, or click to browse'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedFile ? `${formatFileSize(selectedFile.size)} • Click to choose different file` : 'Files are hashed locally in memory and never uploaded to any server.'}
                </p>
              </div>
            </label>
          </div>

          {/* Optional Compare Mode Input */}
          <div>
            <label htmlFor="expected-hash" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Compare with Expected Hash (Optional):
            </label>
            <input
              id="expected-hash"
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="Paste official vendor or release hash to compare..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs sm:text-sm"
            />
          </div>
        </div>
      }
    />
  );
}
