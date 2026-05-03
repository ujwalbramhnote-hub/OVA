const AUDIT_KEY = 'votechain_audit_log';
const MAX_ENTRIES = 100;

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

export const readAuditLog = () => {
  try {
    const raw = safeGet(AUDIT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const recordAuditEvent = ({ action, subject, detail = '', level = 'info' }) => {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    action,
    subject,
    detail,
    level,
    timestamp: new Date().toISOString()
  };

  const next = [entry, ...readAuditLog()].slice(0, MAX_ENTRIES);
  safeSet(AUDIT_KEY, JSON.stringify(next));
  return entry;
};

export const clearAuditLog = () => {
  try {
    localStorage.removeItem(AUDIT_KEY);
  } catch {}
};
