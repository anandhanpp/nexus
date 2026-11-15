import React, { useState, useEffect, useRef } from 'react';
import ToolPage from '../../components/common/ToolPage';
import { 
  isVaultInitialized, 
  initializeVault, 
  unlockVault, 
  saveVaultNotes, 
  wipeVault 
} from '../../utils/vault';
import { TOOLS } from '../../data/toolsData';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  ShieldAlert, 
  Clock, 
  FileText,
  AlertTriangle
} from 'lucide-react';

const AUTO_LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export default function CryptoVault() {
  const toolMeta = TOOLS.find(t => t.id === 'crypto-vault');
  const [initialized, setInitialized] = useState(false);
  const [checkingInit, setCheckingInit] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // New Note modal / inline form
  const [newTitle, setNewTitle] = useState('');
  const [newSecret, setNewSecret] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Auto-lock timer ref
  const autoLockTimerRef = useRef(null);

  const resetAutoLockTimer = () => {
    if (autoLockTimerRef.current) clearTimeout(autoLockTimerRef.current);
    autoLockTimerRef.current = setTimeout(() => {
      handleLock();
    }, AUTO_LOCK_TIMEOUT_MS);
  };

  useEffect(() => {
    async function checkInit() {
      const exists = await isVaultInitialized();
      setInitialized(exists);
      setCheckingInit(false);
    }
    checkInit();

    const handleUserActivity = () => {
      if (isUnlocked) resetAutoLockTimer();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      if (autoLockTimerRef.current) clearTimeout(autoLockTimerRef.current);
    };
  }, [isUnlocked]);

  const handleCreateVault = async () => {
    setError(null);
    if (!masterPassword || masterPassword.length < 8) {
      setError('Master password must be at least 8 characters long.');
      return;
    }
    if (masterPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      await initializeVault(masterPassword);
      setInitialized(true);
      setIsUnlocked(true);
      setNotes([]);
      resetAutoLockTimer();
    } catch (err) {
      setError(err.message || 'Failed to initialize vault');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    setError(null);
    if (!masterPassword) {
      setError('Please enter your master password.');
      return;
    }

    setLoading(true);
    try {
      const decryptedNotes = await unlockVault(masterPassword);
      setNotes(decryptedNotes || []);
      setIsUnlocked(true);
      resetAutoLockTimer();
    } catch (err) {
      setError(err.message || 'Incorrect master password');
    } finally {
      setLoading(false);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setMasterPassword('');
    setConfirmPassword('');
    setNotes([]);
    setShowAddForm(false);
    if (autoLockTimerRef.current) clearTimeout(autoLockTimerRef.current);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSecret.trim()) return;

    const noteItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      secret: newSecret.trim(),
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [noteItem, ...notes];
    try {
      await saveVaultNotes(updated, masterPassword);
      setNotes(updated);
      setNewTitle('');
      setNewSecret('');
      setShowAddForm(false);
      resetAutoLockTimer();
    } catch (err) {
      setError('Failed to save note to encrypted vault.');
    }
  };

  const handleDeleteNote = async (id) => {
    const updated = notes.filter(n => n.id !== id);
    try {
      await saveVaultNotes(updated, masterPassword);
      setNotes(updated);
      resetAutoLockTimer();
    } catch (err) {
      setError('Failed to update vault notes.');
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      vault_header: localStorage.getItem('nexus_vault_header'),
      vault_notes: localStorage.getItem('nexus_vault_notes')
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-vault-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        if (backup.vault_header && backup.vault_notes) {
          localStorage.setItem('nexus_vault_header', backup.vault_header);
          localStorage.setItem('nexus_vault_notes', backup.vault_notes);
          alert('Encrypted backup successfully restored. Unlock with your backup master password.');
          handleLock();
          setInitialized(true);
        } else {
          setError('Invalid vault backup format');
        }
      } catch {
        setError('Corrupted or invalid JSON backup file');
      }
    };
    reader.readAsText(file);
  };

  const handleWipe = async () => {
    if (window.confirm('Are you sure you want to completely erase your vault? All notes will be permanently destroyed.')) {
      await wipeVault();
      handleLock();
      setInitialized(false);
    }
  };

  // Build result summary if unlocked
  const resultData = isUnlocked ? {
    status: 'safe',
    summary: `Vault Unlocked • ${notes.length} Secret Item${notes.length === 1 ? '' : 's'}`,
    explanation: 'Zero-knowledge session active. Notes are decrypted in local volatile RAM only. Auto-locks after 5 minutes of inactivity.',
    rawTextForExport: `NEXUS VAULT EXPORT (DECRYPTED)\nTotal Items: ${notes.length}\nDate: ${new Date().toISOString()}\n\n` + 
      notes.map(n => `Title: ${n.title}\nDate: ${n.createdAt}\nSecret:\n${n.secret}\n---`).join('\n\n'),
    details: (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel New Secret' : 'Add New Secret'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-navy-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>

            <button
              type="button"
              onClick={handleLock}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Now</span>
            </button>
          </div>
        </div>

        {/* Add Note Form */}
        {showAddForm && (
          <form onSubmit={handleAddNote} className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Title / Label
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Server Root SSH Key, Recovery Seed, VPN Token"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Confidential Secret Text
              </label>
              <textarea
                rows={3}
                value={newSecret}
                onChange={(e) => setNewSecret(e.target.value)}
                placeholder="Paste the secret notes, passwords, or recovery codes..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-sm font-mono"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-semibold text-xs shadow-sm hover:bg-cyan-500"
            >
              Save Encrypted Secret
            </button>
          </form>
        )}

        {/* Notes Listing */}
        {notes.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Your vault is empty. Click "Add New Secret" to encrypt your first note.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div 
                key={note.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                      {note.title}
                    </h5>
                    <span className="text-[11px] text-slate-400">Added {note.createdAt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete secret"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-950 font-mono text-xs text-slate-800 dark:text-slate-200 select-all break-all whitespace-pre-wrap">
                  {note.secret}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  } : null;

  return (
    <ToolPage
      toolId="crypto-vault"
      title="Zero-Knowledge Crypto Vault"
      description="Store encrypted confidential notes, recovery keys, and credentials directly in your browser with AES-256-GCM."
      actionButtonText={!initialized ? 'Create Encrypted Vault' : isUnlocked ? 'Lock Vault' : 'Unlock Vault'}
      onAction={!initialized ? handleCreateVault : isUnlocked ? handleLock : handleUnlock}
      loading={loading}
      error={error}
      result={resultData}
      onClear={() => handleLock()}
      helpLines={toolMeta?.helpText || []}
      relatedToolIds={toolMeta?.related || []}
      inputElement={
        <div className="space-y-4">
          {/* Recovery Warning Banner */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Important Security Notice:</span>
              Your master password derives the AES-GCM encryption key locally. There is NO "Forgot Password" or server recovery. If you lose your master password, your encrypted data cannot be recovered by anyone.
            </div>
          </div>

          {!initialized ? (
            <div className="space-y-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Set Up Your Master Vault Password
              </span>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Master Password (min 8 chars)
                </label>
                <input
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Create a strong master password..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Confirm Master Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your master password..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>
            </div>
          ) : !isUnlocked ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Vault Locked • Enter Master Password
                </label>
                <button
                  type="button"
                  onClick={handleWipe}
                  className="text-xs text-rose-500 hover:underline cursor-pointer"
                >
                  Wipe & Reset Vault
                </button>
              </div>
              <input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Enter master password to unlock..."
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 text-base"
              />
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                <label className="cursor-pointer hover:text-cyan-500 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore from backup JSON</span>
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                <Unlock className="w-4 h-4" />
                <span>Vault is currently Unlocked and Decrypted in RAM</span>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Auto-lock active (5m)
              </span>
            </div>
          )}
        </div>
      }
    />
  );
}
