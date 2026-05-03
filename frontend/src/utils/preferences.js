const PREFS_KEY = 'votechain_preferences';

const defaults = {
  compactMode: false,
  showEmail: true,
  refresh30s: true,
  soundOnAction: false,
  rememberTheme: true
};

const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

export const readPreferences = () => {
  try {
    const raw = safeGet(PREFS_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...(parsed || {}) };
  } catch {
    return defaults;
  }
};

export const writePreferences = (nextPrefs) => {
  safeSet(PREFS_KEY, JSON.stringify(nextPrefs));
};

export const defaultPreferences = defaults;
