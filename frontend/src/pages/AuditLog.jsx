import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Filter, RefreshCw, ShieldCheck, Trash2, UserCheck, Vote } from 'lucide-react';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';
import { clearAuditLog, readAuditLog } from '../utils/audit';

const levelStyles = {
  info: 'border-[color:var(--accent-2)]/30 bg-[color:var(--accent-2)]/12 text-[color:var(--accent-2)]',
  success: 'border-[color:var(--success)]/30 bg-[color:var(--success)]/12 text-[color:var(--success)]',
  warning: 'border-[#D59A3E]/30 bg-[#D59A3E]/12 text-[#D59A3E]',
  error: 'border-[#C46A6A]/30 bg-[#C46A6A]/12 text-[#C46A6A]'
};

const AuditLog = () => {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('backend');

  const mergeEntries = (backendEntries = []) => {
    const localEntries = readAuditLog().map((entry) => ({
      ...entry,
      source: 'local'
    }));

    const normalizedBackend = backendEntries.map((entry) => ({
      ...entry,
      source: 'backend'
    }));

    const combined = [...normalizedBackend, ...localEntries];
    const deduped = [];
    const seen = new Set();

    for (const entry of combined) {
      const key = [
        entry.action,
        entry.subject,
        entry.detail,
        entry.level,
        entry.timestamp
      ].join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(entry);
    }

    deduped.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return deduped;
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/audit/events');
      setEntries(mergeEntries(response.data || []));
      setSource('backend');
    } catch {
      setEntries(mergeEntries([]));
      setSource('local');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesQuery =
        !query ||
        [entry.action, entry.subject, entry.detail, entry.actor]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesLevel = level === 'all' || entry.level === level;
      return matchesQuery && matchesLevel;
    });
  }, [entries, level, query]);

  const stats = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc[entry.level] = (acc[entry.level] || 0) + 1;
        return acc;
      },
      { info: 0, success: 0, warning: 0, error: 0 }
    );
  }, [entries]);

  const handleClear = () => {
    clearAuditLog();
    refresh();
  };

  if (loading && entries.length === 0) {
    return <AuditSkeleton />;
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <motion.section variants={slideUp} className="rounded-[1.75rem] border border-theme bg-elevated p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-1 text-xs font-medium text-accent-hover-theme">
              <ShieldCheck size={14} />
              Audit trail
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary-theme md:text-4xl">
              Audit Log
            </h1>
            <p className="mt-3 text-sm leading-6 text-secondary-theme md:text-base">
              Backend-backed history is shown here first. Local-only settings entries are merged in as a fallback so the log remains useful even if the API is unavailable.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatMini label="Events" value={entries.length} />
            <StatMini label="Votes" value={stats.success} />
            <StatMini label="Source" value={source === 'backend' ? 'API' : 'Fallback'} />
          </div>
        </div>
      </motion.section>

      <motion.section variants={slideUp}>
        <Card className="p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={refresh}>
                <RefreshCw size={16} />
                Refresh
              </Button>
              <Button variant="secondary" onClick={handleClear}>
                <Trash2 size={16} />
                Clear local entries
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="min-w-[220px] flex-1">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-muted-theme">Search</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search action, user, or detail"
                  className="w-full rounded-xl border border-theme bg-elevated px-4 py-3 text-sm text-primary-theme outline-none transition-colors placeholder:text-muted-theme focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-2)]/30"
                />
              </label>

              <label className="w-full min-w-[160px] sm:w-[180px]">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-muted-theme">Filter</span>
                <div className="relative">
                  <Filter size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-theme" />
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-theme bg-elevated py-3 pl-10 pr-4 text-sm text-primary-theme outline-none transition-colors focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-2)]/30"
                  >
                    <option value="all">All levels</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </label>
            </div>
          </div>
        </Card>
      </motion.section>

      <motion.section variants={slideUp}>
        <Card className="overflow-hidden">
          <div className="border-b border-theme px-5 py-4 md:px-6">
            <div className="flex items-center gap-2 text-sm text-secondary-theme">
              <Activity size={16} />
              <span>{filteredEntries.length} matching events</span>
            </div>
          </div>

          <div className="p-5 md:p-6">
            {filteredEntries.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-theme bg-surface p-10 text-center">
                <p className="text-lg font-semibold text-primary-theme">No audit events yet</p>
                <p className="mt-2 text-sm text-secondary-theme">Use the app to sign in, cast a vote, or change settings and events will appear here.</p>
              </div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
                {filteredEntries.map((entry) => (
                  <motion.div key={entry.id} variants={slideUp} className="rounded-2xl border border-theme bg-elevated p-4 md:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${levelStyles[entry.level] || levelStyles.info}`}>
                            {entry.action === 'vote_cast' ? <Vote size={12} /> : <UserCheck size={12} />}
                            {entry.level}
                          </span>
                          <span className="text-xs uppercase tracking-[0.22em] text-muted-theme">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                          <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${entry.source === 'backend' ? 'border-theme bg-surface text-secondary-theme' : 'border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 text-accent-hover-theme'}`}>
                            {entry.source}
                          </span>
                        </div>
                        <p className="mt-3 text-base font-semibold text-primary-theme">{entry.action}</p>
                        <p className="mt-1 text-sm text-secondary-theme">{entry.subject}</p>
                        {entry.detail ? <p className="mt-2 text-sm leading-6 text-secondary-theme">{entry.detail}</p> : null}
                        {entry.actor ? <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-theme">{entry.actor} · {entry.actorRole}</p> : null}
                      </div>
                      <div className="rounded-xl border border-theme bg-surface px-3 py-2 text-xs uppercase tracking-[0.22em] text-muted-theme">
                        Recorded
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
};

const StatMini = ({ label, value }) => (
  <Card className="min-w-[120px] p-4">
    <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-primary-theme">{value}</p>
  </Card>
);

const AuditSkeleton = () => (
  <div className="space-y-6">
    <div className="h-[220px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
    <div className="h-[160px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
    <div className="h-[420px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
  </div>
);

export default AuditLog;
