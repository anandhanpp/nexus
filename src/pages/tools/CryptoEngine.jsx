import React, { useState } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { 
  computeMD5, 
  computeSubtleHash, 
  toBase64, 
  fromBase64, 
  toHex, 
  fromHex, 
  toUrlEncoded, 
  fromUrlEncoded, 
  encryptAESGCM, 
  decryptAESGCM 
} from '../../utils/crypto';
import { TOOLS } from '../../data/toolsData';
import { Binary, Key, ShieldAlert } from 'lucide-react';

const MODES = [
  { id: 'hash', name: 'Cryptographic Hash' },
  { id: 'codec', name: 'Encode / Decode' },
  { id: 'cipher', name: 'AES-256-GCM Cipher' }
];

export default function CryptoEngine() {
  const toolMeta = TOOLS.find(t => t.id === 'crypto-engine');
  const [activeMode, setActiveMode] = useState('hash');
  const [inputText, setInputText] = useState('Hello Nexus Cybersecurity!');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Hash state
  const [hashAlgo, setHashAlgo] = useState('SHA-256');

  // Codec state
  const [codecAlgo, setCodecAlgo] = useState('Base64');
  const [codecDirection, setCodecDirection] = useState('encode');

  // Cipher state
  const [cipherDirection, setCipherDirection] = useState('encrypt');
  const [passphrase, setPassphrase] = useState('');

  const handleExecute = async () => {
    setError(null);
    if (!inputText) {
      setError('Please provide input characters in the text buffer.');
      return;
    }

    try {
      if (activeMode === 'hash') {
        let outputHash = '';
        let warning = '';
        let isCollisionProne = false;

        if (hashAlgo === 'MD5') {
          outputHash = computeMD5(inputText);
          warning = 'MD5 exhibits known hash collision vulnerabilities. Do NOT use for credentials, certificates, or digital signatures.';
          isCollisionProne = true;
        } else if (hashAlgo === 'SHA-1') {
          outputHash = await computeSubtleHash('SHA-1', inputText);
          warning = 'SHA-1 is deprecated due to practical collision exploits. Upgrade to SHA-256 or SHA-512 for production use.';
          isCollisionProne = true;
        } else if (hashAlgo === 'SHA-256') {
          outputHash = await computeSubtleHash('SHA-256', inputText);
        } else if (hashAlgo === 'SHA-512') {
          outputHash = await computeSubtleHash('SHA-512', inputText);
        }

        const summary = `${hashAlgo}: ${outputHash.substring(0, 16)}...`;
        const explanation = isCollisionProne
          ? `Calculated ${hashAlgo} digest. Warning: ${warning}`
          : `Computed secure ${hashAlgo} digest (${outputHash.length * 4} bits). Meets modern cryptographic integrity and authentication standards.`;

        setResult({
          status: isCollisionProne ? 'warning' : 'safe',
          summary,
          explanation,
          rawTextForExport: `Algorithm: ${hashAlgo}\nInput: ${inputText}\nDigest: ${outputHash}\nBits: ${outputHash.length * 4}`,
          details: (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Complete {hashAlgo} Digest</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 break-all select-all">
                  {outputHash}
                </span>
              </div>

              {isCollisionProne && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{warning}</span>
                </div>
              )}
            </div>
          )
        });
      } else if (activeMode === 'codec') {
        let output = '';
        if (codecAlgo === 'Base64') {
          output = codecDirection === 'encode' ? toBase64(inputText) : fromBase64(inputText);
        } else if (codecAlgo === 'Hex') {
          output = codecDirection === 'encode' ? toHex(inputText) : fromHex(inputText);
        } else if (codecAlgo === 'URL') {
          output = codecDirection === 'encode' ? toUrlEncoded(inputText) : fromUrlEncoded(inputText);
        }

        setResult({
          status: 'safe',
          summary: `${codecAlgo} ${codecDirection === 'encode' ? 'Encoded' : 'Decoded'}`,
          explanation: `Successfully processed via ${codecAlgo}. Encoding changes representation for transport; it does NOT provide encryption or secrecy.`,
          rawTextForExport: output,
          details: (
            <div className="p-3.5 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">{codecAlgo} Output Buffer</span>
              <div className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 break-all select-all">
                {output}
              </div>
            </div>
          )
        });
      } else if (activeMode === 'cipher') {
        if (!passphrase) {
          setError('Please provide a secret passphrase for key derivation.');
          return;
        }

        let output = '';
        if (cipherDirection === 'encrypt') {
          output = await encryptAESGCM(inputText, passphrase);
        } else {
          output = await decryptAESGCM(inputText, passphrase);
        }

        setResult({
          status: 'safe',
          summary: `AES-256-GCM ${cipherDirection === 'encrypt' ? 'Encrypted' : 'Decrypted'}`,
          explanation: cipherDirection === 'encrypt'
            ? 'Plaintext encrypted with AES-256-GCM using PBKDF2 key derivation (100,000 rounds) and random 12-byte IV.'
            : 'Ciphertext successfully verified and decrypted in RAM.',
          rawTextForExport: output,
          details: (
            <div className="p-3.5 rounded-lg bg-white dark:bg-carbon-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {cipherDirection === 'encrypt' ? 'Base64 Payload (Salt + IV + Ciphertext)' : 'Decrypted Plaintext Output'}
              </span>
              <div className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 break-all select-all">
                {output}
              </div>
            </div>
          )
        });
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please verify input syntax.');
    }
  };

  return (
    <ToolPage
      toolId="crypto-engine"
      title="Cryptographic Engine & Hasher"
      description="Compute cryptographic digests (MD5, SHA-256, SHA-512), convert standard codecs (Base64, Hex, URL), and encrypt data with authenticated AES-GCM."
      actionButtonText={
        activeMode === 'hash' 
          ? `HASH WITH ${hashAlgo}` 
          : activeMode === 'codec' 
            ? `${codecDirection === 'encode' ? 'ENCODE' : 'DECODE'} ${codecAlgo.toUpperCase()}` 
            : `${cipherDirection === 'encrypt' ? 'ENCRYPT' : 'DECRYPT'} AES-GCM`
      }
      onAction={handleExecute}
      error={error}
      result={result}
      onClear={() => {
        setInputText('');
        setPassphrase('');
        setResult(null);
        setError(null);
      }}
      helpLines={toolMeta?.helpText || []}
      relatedToolIds={toolMeta?.related || []}
      inputElement={
        <div className="space-y-4 font-mono">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-carbon-850 border border-slate-200 dark:border-slate-800">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setActiveMode(mode.id);
                  setResult(null);
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeMode === mode.id
                    ? 'bg-white dark:bg-carbon-750 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode.name}
              </button>
            ))}
          </div>

          {/* Mode Controls */}
          {activeMode === 'hash' && (
            <div className="flex items-center gap-3">
              <label htmlFor="hash-algo" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ALGORITHM:
              </label>
              <select
                id="hash-algo"
                value={hashAlgo}
                onChange={(e) => setHashAlgo(e.target.value)}
                className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="SHA-256">SHA-256 (Industry Standard)</option>
                <option value="SHA-512">SHA-512 (High Security)</option>
                <option value="SHA-1">SHA-1 (Legacy / Insecure)</option>
                <option value="MD5">MD5 (Legacy / Insecure)</option>
              </select>
            </div>
          )}

          {activeMode === 'codec' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="codec-algo" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  FORMAT:
                </label>
                <select
                  id="codec-algo"
                  value={codecAlgo}
                  onChange={(e) => setCodecAlgo(e.target.value)}
                  className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="Base64">Base64</option>
                  <option value="Hex">Hexadecimal</option>
                  <option value="URL">URL Encoding</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-carbon-850 p-1 rounded-md border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCodecDirection('encode')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${codecDirection === 'encode' ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-carbon-950' : 'text-slate-500'}`}
                >
                  Encode
                </button>
                <button
                  type="button"
                  onClick={() => setCodecDirection('decode')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${codecDirection === 'decode' ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-carbon-950' : 'text-slate-500'}`}
                >
                  Decode
                </button>
              </div>
            </div>
          )}

          {activeMode === 'cipher' && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-carbon-850 p-1 rounded-md border border-slate-200 dark:border-slate-800 w-fit">
                <button
                  type="button"
                  onClick={() => setCipherDirection('encrypt')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${cipherDirection === 'encrypt' ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-carbon-950' : 'text-slate-500'}`}
                >
                  Encrypt Plaintext
                </button>
                <button
                  type="button"
                  onClick={() => setCipherDirection('decrypt')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${cipherDirection === 'decrypt' ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-carbon-950' : 'text-slate-500'}`}
                >
                  Decrypt Ciphertext
                </button>
              </div>

              <div>
                <label htmlFor="cipher-pass" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  PASSPHRASE KEY DERIVATION (PBKDF2):
                </label>
                <input
                  id="cipher-pass"
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter secret passphrase..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>
          )}

          {/* Text Area */}
          <div>
            <label htmlFor="crypto-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {activeMode === 'cipher' && cipherDirection === 'decrypt' ? 'ENCRYPTED BASE64 CIPHERTEXT' : 'BUFFER STRING'}
            </label>
            <textarea
              id="crypto-input"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to process..."
              className="w-full px-3.5 py-3 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-carbon-850 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs sm:text-sm"
            />
          </div>
        </div>
      }
    />
  );
}
