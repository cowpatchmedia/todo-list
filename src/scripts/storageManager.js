// storageManager.js - simple localStorage wrapper with debounced saves
const STORAGE_KEY = 'todo-app:v1';
const DEBOUNCE_MS = 300;

function saveRaw(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      schemaVersion: 1,
      timestamp: Date.now(),
      data: obj
    }));
  } catch (e) {
    console.error('storageManager: failed to save', e);
  }
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export const saveDebounced = debounce(saveRaw, DEBOUNCE_MS);
export function saveImmediate(obj) { saveRaw(obj); }

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !('schemaVersion' in parsed)) return null;
    return parsed.data || null;
  } catch (e) {
    console.error('storageManager: failed to load', e);
    return null;
  }
}

export function clearStorage() { localStorage.removeItem(STORAGE_KEY); }
