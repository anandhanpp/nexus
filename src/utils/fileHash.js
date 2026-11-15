// File Integrity and Hashing Utilities

export async function hashFile(file, algorithm = 'SHA-256', onProgress = null) {
  if (!file) throw new Error('No file provided');

  // For smaller files (< 100MB), read directly as ArrayBuffer
  if (file.size < 100 * 1024 * 1024) {
    if (onProgress) onProgress(30);
    const buffer = await file.arrayBuffer();
    if (onProgress) onProgress(70);
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    if (onProgress) onProgress(100);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // For larger files: slice-based reading
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const BASELINE_KEY = 'nexus_file_baselines';

export function getFileBaselines() {
  try {
    const raw = localStorage.getItem(BASELINE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFileBaseline(fileRecord) {
  const list = getFileBaselines();
  // Filter out any existing item with the same id/name
  const updated = [fileRecord, ...list.filter(item => item.name !== fileRecord.name)];
  localStorage.setItem(BASELINE_KEY, JSON.stringify(updated.slice(0, 30)));
  return updated;
}

export function removeFileBaseline(name) {
  const list = getFileBaselines();
  const updated = list.filter(item => item.name !== name);
  localStorage.setItem(BASELINE_KEY, JSON.stringify(updated));
  return updated;
}
