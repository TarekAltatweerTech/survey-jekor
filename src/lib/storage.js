// localStorage can be missing or throw (private mode, blocked site data), so every
// access is guarded and the page works without it.

const PREFIX = 'jekor-survey:';

export function load(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable: nothing to keep */
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* storage unavailable */
  }
}

function randomId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

let sessionDeviceId = null;

/**
 * The id the server uses to accept one answer per device. Kept for good in
 * localStorage; when storage is blocked it only lives as long as the tab.
 */
export function deviceId() {
  let id = load('device');
  if (!id) {
    id = sessionDeviceId || randomId();
    sessionDeviceId = id;
    save('device', id);
  }
  return id;
}
