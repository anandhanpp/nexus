// Crypto Vault Utility with IndexedDB & AES-GCM
import { encryptAESGCM, decryptAESGCM } from './crypto';

const DB_NAME = 'NexusCryptoVault';
const STORE_NAME = 'vault_data';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Check if a vault already exists
export async function isVaultInitialized() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('vault_header');
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });
  } catch {
    // fallback check localStorage
    return !!localStorage.getItem('nexus_vault_header');
  }
}

// Initialize vault with master password
export async function initializeVault(masterPassword) {
  // We store a known encrypted verification token to verify password on unlock
  const verificationPayload = await encryptAESGCM('NEXUS_VAULT_TOKEN_VERIFIED', masterPassword);
  const emptyNotesPayload = await encryptAESGCM(JSON.stringify([]), masterPassword);

  const header = {
    id: 'vault_header',
    verification: verificationPayload,
    updatedAt: new Date().toISOString()
  };

  const notesRecord = {
    id: 'vault_notes',
    payload: emptyNotesPayload,
    updatedAt: new Date().toISOString()
  };

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(header);
    store.put(notesRecord);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch {
    // fallback localStorage
    localStorage.setItem('nexus_vault_header', JSON.stringify(header));
    localStorage.setItem('nexus_vault_notes', JSON.stringify(notesRecord));
  }

  return true;
}

// Unlock vault: verify master password and return notes
export async function unlockVault(masterPassword) {
  let header, notesRecord;

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    header = await new Promise((res, rej) => {
      const r = store.get('vault_header');
      r.onsuccess = () => res(r.result);
      r.onerror = rej;
    });

    notesRecord = await new Promise((res, rej) => {
      const r = store.get('vault_notes');
      r.onsuccess = () => res(r.result);
      r.onerror = rej;
    });
  } catch {
    const h = localStorage.getItem('nexus_vault_header');
    const n = localStorage.getItem('nexus_vault_notes');
    if (h) header = JSON.parse(h);
    if (n) notesRecord = JSON.parse(n);
  }

  if (!header || !header.verification) {
    throw new Error('No existing vault found. Please create one.');
  }

  // Verify password by decrypting verification token
  let verified = false;
  try {
    const token = await decryptAESGCM(header.verification, masterPassword);
    if (token === 'NEXUS_VAULT_TOKEN_VERIFIED') {
      verified = true;
    }
  } catch {
    throw new Error('Incorrect master password. Please verify and try again.');
  }

  if (!verified) {
    throw new Error('Incorrect master password.');
  }

  // Decrypt notes
  let notes = [];
  if (notesRecord && notesRecord.payload) {
    const notesJson = await decryptAESGCM(notesRecord.payload, masterPassword);
    notes = JSON.parse(notesJson);
  }

  return notes;
}

// Save notes back to encrypted storage
export async function saveVaultNotes(notes, masterPassword) {
  const encryptedPayload = await encryptAESGCM(JSON.stringify(notes), masterPassword);
  const notesRecord = {
    id: 'vault_notes',
    payload: encryptedPayload,
    updatedAt: new Date().toISOString()
  };

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(notesRecord);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch {
    localStorage.setItem('nexus_vault_notes', JSON.stringify(notesRecord));
  }
  return true;
}

// Reset / wipe vault completely
export async function wipeVault() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    await new Promise((res) => { tx.oncomplete = res; });
  } catch {
    // fallback
  }
  localStorage.removeItem('nexus_vault_header');
  localStorage.removeItem('nexus_vault_notes');
}
