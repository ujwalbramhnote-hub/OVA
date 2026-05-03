import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, TimerReset, Users, Vote } from 'lucide-react';
import axios from '../api/axios';
import ElectionTicker from '../components/election/ElectionTicker';
import Card from '../components/ui/Card';
import { fadeIn, slideUp } from '../utils/animations';

const LiveResults = () => {
  const [results, setResults] = useState([]);
  const [registeredVoters, setRegisteredVoters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    let intervalId;

    const fetchResults = async () => {
      setError('');
      try {
        const [resultsRes, usersRes] = await Promise.allSettled([
          axios.get('/api/results'),
          axios.get('/api/admin/users')
        ]);

        if (!mounted) return;

        if (resultsRes.status === 'fulfilled') {
          setResults(resultsRes.value.data || []);
        } else {
          setResults([]);
          setError(resultsRes.reason?.response?.data?.message || 'Unable to load live results.');
        }

        if (usersRes.status === 'fulfilled') {
          setRegisteredVoters(usersRes.value.data?.length ?? null);
        } else {
          setRegisteredVoters(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResults();
    intervalId = window.setInterval(fetchResults, 30000);
    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const stats = useMemo(() => {
    const votesCast = results.reduce((sum, candidate) => sum + (candidate.totalVotes ?? 0), 0);
    const ranked = [...results].sort((a, b) => (b.totalVotes ?? 0) - (a.totalVotes ?? 0));
    const leader = ranked[0] || null;
    return { votesCast, leader, leaderVotes: leader?.totalVotes ?? 0 };
  }, [results]);

  const percentData = useMemo(() => {
    const total = stats.votesCast || 0;
    return [...results]
      .sort((a, b) => (b.totalVotes ?? 0) - (a.totalVotes ?? 0))
      .map((candidate) => ({
        ...candidate,
        votes: candidate.totalVotes ?? 0,
        percentage: total > 0 ? Math.round(((candidate.totalVotes ?? 0) / total) * 100) : 0
      }));
  }, [results, stats.votesCast]);

  const campaignItems = useMemo(() => {
    const leaderName = stats.leader?.name || 'Lead candidate';
    return [
      { badge: 'Campaign pulse', title: 'Election ads keep the conversation moving', detail: 'Short messages, clear promises, and visible voter reminders.', tone: 'gold' },
      { badge: 'Live standings', title: `${leaderName} is ahead right now`, detail: 'The current public count updates as ballots are recorded.', tone: 'blue' },
      ...percentData.slice(0, 3).map((candidate, index) => ({
        badge: candidate.party || 'Candidate update',
        title: candidate.name,
        detail: `${candidate.percentage}% of recorded votes`,
        tone: index % 2 === 0 ? 'gold' : 'blue'
      }))
    ];
  }, [percentData, stats.leader?.name]);

  if (loading) return <ResultsSkeleton />;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <motion.section variants={slideUp} className="rounded-[1.75rem] border border-theme bg-elevated p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-1 text-xs font-medium text-accent-hover-theme">
              <TimerReset size={14} />
              Live analytics · updating every 30s
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary-theme md:text-4xl">
              Election Live Results
            </h1>
            <p className="mt-3 text-sm leading-6 text-secondary-theme md:text-base">
              Candidate standings are refreshed from the current backend response with restrained, readable status cards.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[560px]">
            <StatCard label="Registered voters" value={registeredVoters ?? 'Restricted'} icon={<Users size={16} />} />
            <StatCard label="Votes cast" value={stats.votesCast} icon={<Vote size={16} />} accent />
            <StatCard
              label="Current leader"
              value={stats.leader?.name || 'N/A'}
              sub={stats.leader ? `${stats.leaderVotes} votes` : 'Waiting for results'}
              icon={<BadgeCheck size={16} />}
            />
          </div>
        </div>

        {error ? <div className="mt-5 rounded-xl border border-[#8C4E4E] bg-[#2A1717] px-4 py-3 text-sm text-accent-hover-theme">{error}</div> : null}
      </motion.section>

      <motion.section variants={slideUp}>
        <ElectionTicker label="Election broadcast ticker" items={campaignItems} />
      </motion.section>

      <motion.section variants={slideUp}>
        <Card className="p-6 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary-theme">Vote distribution</h2>
              <p className="mt-1 text-sm text-secondary-theme">Horizontal progress bars based on the live vote totals.</p>
            </div>
            <p className="text-sm text-muted-theme">Total votes: {stats.votesCast}</p>
          </div>

          <div className="mt-6 space-y-4">
            {percentData.map((candidate, index) => (
              <motion.div
                key={candidate.id || candidate.name}
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-theme bg-elevated p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-primary-theme">{candidate.name}</p>
                    <p className="mt-1 text-sm text-secondary-theme">{candidate.party || 'Independent'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-accent-hover-theme">{candidate.percentage}%</p>
                    <p className="text-xs text-muted-theme">{candidate.votes} votes</p>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-app">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${candidate.percentage}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full bg-accent-theme"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
};

const StatCard = ({ label, value, sub, icon, accent = false }) => (
  <Card className={`p-4 ${accent ? 'border-[color:var(--accent-2)]/30' : ''}`}>
    <div className="flex items-start gap-3">
      <div className={`rounded-xl p-2.5 ${accent ? 'bg-[color:var(--accent-2)]/12 text-[color:var(--accent-2)]' : 'bg-[color:var(--accent)]/12 text-accent-hover-theme'}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">{label}</p>
        <p className="mt-2 truncate text-lg font-semibold text-primary-theme">{value}</p>
        {sub ? <p className="mt-1 text-sm text-secondary-theme">{sub}</p> : null}
      </div>
    </div>
  </Card>
);

const ResultsSkeleton = () => (
  <div className="space-y-6">
    <div className="h-[220px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
    <div className="h-[380px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
  </div>
);

export default LiveResults;
