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
  { id: 'cipher', name: 'AES-GCM Encryption' }
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
  const [codecDirection, setCodecDirection] = useState('encode'); // 'encode' | 'decode'

  // Cipher state
  const [cipherDirection, setCipherDirection] = useState('encrypt'); // 'encrypt' | 'decrypt'
  const [passphrase, setPassphrase] = useState('');

  const handleExecute = async () => {
    setError(null);
    if (!inputText) {
      setError('Please enter some text in the input box.');
      return;
    }

    try {
      if (activeMode === 'hash') {
        let outputHash = '';
        let warning = '';
        let isCollisionProne = false;

        if (hashAlgo === 'MD5') {
          outputHash = computeMD5(inputText);
          warning = 'MD5 has known cryptographic collision vulnerabilities. Do NOT use for passwords or digital signatures.';
          isCollisionProne = true;
        } else if (hashAlgo === 'SHA-1') {
          outputHash = await computeSubtleHash('SHA-1', inputText);
          warning = 'SHA-1 is deprecated due to practical collision attacks (SHAttered). Use SHA-256 or SHA-512 instead.';
          isCollisionProne = true;
        } else if (hashAlgo === 'SHA-256') {
          outputHash = await computeSubtleHash('SHA-256', inputText);
        } else if (hashAlgo === 'SHA-512') {
          outputHash = await computeSubtleHash('SHA-512', inputText);
        }

        const summary = `${hashAlgo}: ${outputHash.substring(0, 16)}...`;
        const explanation = isCollisionProne
          ? `Calculated ${hashAlgo} digest. Warning: ${warning}`
          : `Calculated secure ${hashAlgo} digest (${outputHash.length * 4} bits). Suitable for cryptographic integrity and authentication.`;

        setResult({
          status: isCollisionProne ? 'warning' : 'safe',
          summary,
          explanation,
          rawTextForExport: `Algorithm: ${hashAlgo}\nInput: ${inputText}\nHash: ${outputHash}\nBit-length: ${outputHash.length * 4}`,
          details: (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-xs text-slate-500 block uppercase font-semibold">Complete {hashAlgo} Digest</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 break-all select-all">
                  {outputHash}
                </span>
              </div>

              {isCollisionProne && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
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
          explanation: `Successfully processed via ${codecAlgo}. Encoding is standard data formatting and does NOT provide secrecy or encryption.`,
          rawTextForExport: output,
          details: (
            <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 block uppercase font-semibold">{codecAlgo} Output</span>
              <div className="font-mono text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 break-all select-all">
                {output}
              </div>
            </div>
          )
        });
      } else if (activeMode === 'cipher') {
        if (!passphrase) {
          setError('Please provide an encryption passphrase.');
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
          summary: `AES-256-GCM ${cipherDirection === 'encrypt' ? 'Encrypted' : 'Decrypted'} Successfully`,
          explanation: cipherDirection === 'encrypt'
            ? 'Plaintext was encrypted with AES-256-GCM using a PBKDF2-derived key (100,000 iterations) and a random 12-byte initialization vector (IV).'
            : 'Ciphertext successfully verified and decrypted.',
          rawTextForExport: output,
          details: (
            <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 block uppercase font-semibold">
                {cipherDirection === 'encrypt' ? 'Encrypted Base64 Payload (Salt + IV + Ciphertext)' : 'Decrypted Plaintext'}
              </span>
              <div className="font-mono text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 break-all select-all">
                {output}
              </div>
            </div>
          )
        });
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please verify the input.');
    }
  };

  return (
    <ToolPage
      toolId="crypto-engine"
      title="Cryptographic Engine & Hasher"
      description="Compute cryptographic hashes (MD5, SHA-256, SHA-512), format codecs (Base64, Hex, URL), and encrypt messages with authenticated AES-GCM."
      actionButtonText={
        activeMode === 'hash' 
          ? `Compute ${hashAlgo} Hash` 
          : activeMode === 'codec' 
            ? `${codecDirection === 'encode' ? 'Encode' : 'Decode'} ${codecAlgo}` 
            : `${cipherDirection === 'encrypt' ? 'Encrypt' : 'Decrypt'} AES-GCM`
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
        <div className="space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setActiveMode(mode.id);
                  setResult(null);
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeMode === mode.id
                    ? 'bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode.name}
              </button>
            ))}
          </div>

          {/* Mode Controls */}
          {activeMode === 'hash' && (
            <div className="flex items-center gap-3">
              <label htmlFor="hash-algo" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Algorithm:
              </label>
              <select
                id="hash-algo"
                value={hashAlgo}
                onChange={(e) => setHashAlgo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500"
              >
                <option value="SHA-256">SHA-256 (Recommended / Standard)</option>
                <option value="SHA-512">SHA-512 (High Security)</option>
                <option value="SHA-1">SHA-1 (Legacy / Insecure)</option>
                <option value="MD5">MD5 (Legacy / Insecure)</option>
              </select>
            </div>
          )}

          {activeMode === 'codec' && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="codec-algo" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Format:
                </label>
                <select
                  id="codec-algo"
                  value={codecAlgo}
                  onChange={(e) => setCodecAlgo(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="Base64">Base64</option>
                  <option value="Hex">Hexadecimal</option>
                  <option value="URL">URL Encoding</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-900 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCodecDirection('encode')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${codecDirection === 'encode' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
                >
                  Encode
                </button>
                <button
                  type="button"
                  onClick={() => setCodecDirection('decode')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${codecDirection === 'decode' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
                >
                  Decode
                </button>
              </div>
            </div>
          )}

          {activeMode === 'cipher' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-900 p-1 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setCipherDirection('encrypt')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${cipherDirection === 'encrypt' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
                >
                  Encrypt Text
                </button>
                <button
                  type="button"
                  onClick={() => setCipherDirection('decrypt')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${cipherDirection === 'decrypt' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
                >
                  Decrypt Ciphertext
                </button>
              </div>

              <div>
                <label htmlFor="cipher-pass" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Passphrase / Secret Key:
                </label>
                <input
                  id="cipher-pass"
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter a secret passphrase to encrypt or decrypt..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Text Area */}
          <div>
            <label htmlFor="crypto-input" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              {activeMode === 'cipher' && cipherDirection === 'decrypt' ? 'Encrypted Base64 Payload' : 'Input String'}
            </label>
            <textarea
              id="crypto-input"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to hash, encode, or encrypt..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm transition-colors"
            />
          </div>
        </div>
      }
    />
  );
}
