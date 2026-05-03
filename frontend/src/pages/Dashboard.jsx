import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles, Users, Vote } from 'lucide-react';
import axios from '../api/axios';
import CandidateCard from '../components/candidate/CandidateCard';
import ElectionTicker from '../components/election/ElectionTicker';
import Button from '../components/ui/Button';
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [submittedCandidateId, setSubmittedCandidateId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, candidatesRes] = await Promise.all([
          axios.get('/api/user/profile'),
          axios.get('/api/candidates')
        ]);
        if (!mounted) return;
        setProfile(profileRes.data);
        setCandidates(candidatesRes.data || []);
        setSubmittedCandidateId(profileRes.data?.hasVoted ? profileRes.data?.votedCandidateId ?? null : null);
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || 'Unable to load dashboard data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => { mounted = false; };
  }, []);

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedCandidateId) || null,
    [candidates, selectedCandidateId]
  );
  const campaignItems = useMemo(() => {
    const baseItems = [
      { badge: 'Election message', title: 'Secure ballots build public trust', detail: 'Clear process, visible status, and calm result updates.', tone: 'gold' },
      { badge: 'Turnout push', title: 'Every vote shifts the conversation', detail: 'Campaigns are won on participation, not noise.', tone: 'blue' }
    ];

    const candidateItems = candidates.slice(0, 4).map((candidate, index) => ({
      badge: candidate.party || 'Campaign ad',
      title: candidate.name,
      detail: candidate.description || candidate.manifesto || 'Campaign messaging is live in the ballot stream.',
      tone: index % 2 === 0 ? 'gold' : 'blue'
    }));

    return [...baseItems, ...candidateItems];
  }, [candidates]);

  const alreadyVoted = Boolean(profile?.hasVoted || submittedCandidateId);

  const handleVote = async (candidate) => {
    if (alreadyVoted) return;
    setSelectedCandidateId(candidate.id);
    setError('');
    try {
      await axios.post('/api/user/vote', { candidate_id: candidate.id });
      setSubmittedCandidateId(candidate.id);
      setProfile((current) => (current ? { ...current, hasVoted: true } : current));
    } catch (err) {
      setError(err.response?.data?.message || 'Vote submission failed.');
      setSelectedCandidateId(null);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8 lg:space-y-10">
      <motion.section variants={slideUp} className="overflow-hidden rounded-[1.75rem] border border-theme bg-elevated">
        <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="p-6 md:p-8 lg:p-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-1 text-xs font-medium text-accent-hover-theme">
              <Sparkles size={14} />
              Election status
            </p>
            <h1 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-primary-theme md:text-4xl">
              Secure voting dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-secondary-theme md:text-base lg:max-w-[48rem]">
              Cast a single vote, review candidate profiles, and confirm the submission state without leaving the dashboard.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Pill icon={<ShieldCheck size={14} />} label="Ballot protected" />
              <Pill icon={<Vote size={14} />} label={alreadyVoted ? 'Vote submitted' : 'Vote pending'} accent />
              {selectedCandidate ? <Pill icon={<Users size={14} />} label={`Selected: ${selectedCandidate.name}`} /> : null}
            </div>

            {error ? (
              <div className="mt-5 rounded-xl border border-[#8C4E4E] bg-[#2A1717] px-4 py-3 text-sm text-accent-hover-theme">
                {error}
              </div>
            ) : null}
          </div>

          <div className="border-t border-theme bg-surface p-6 lg:border-l lg:border-t-0 lg:p-8">
            <div className="rounded-[1.35rem] border border-theme bg-elevated p-5 lg:p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-theme">Current voter</p>
              <p className="mt-2 text-xl font-semibold text-primary-theme">{profile?.name || 'Voter'}</p>
              <p className="mt-1 text-sm text-secondary-theme">{profile?.email || 'Signed in account'}</p>
              <div className="mt-6 space-y-3">
                <MetricLine label="Age" value={profile?.age ?? 'N/A'} />
                <MetricLine label="Status" value={alreadyVoted ? 'Vote recorded' : 'Awaiting submission'} />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={slideUp} className="pt-1">
        <ElectionTicker label="Election campaign board" items={campaignItems} />
      </motion.section>

      <motion.section variants={slideUp} className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-primary-theme md:text-2xl">Candidates</h2>
            <p className="mt-1 max-w-2xl text-sm text-secondary-theme">Select one candidate and submit your vote. The cards below are spaced apart so the list reads like a campaign board, not a dense directory.</p>
          </div>
          <p className="text-sm text-muted-theme">{alreadyVoted ? 'Vote locked for this account' : 'One vote per account'}</p>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              selected={selectedCandidateId === candidate.id}
              voted={alreadyVoted}
              onSelect={() => handleVote(candidate)}
            />
          ))}
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {alreadyVoted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-[1.5rem] border border-theme bg-elevated p-6 md:p-7"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent)]/10 text-accent-hover-theme">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-primary-theme">Vote submitted</p>
                  <p className="text-sm text-secondary-theme">
                    {submittedCandidateId
                      ? `Your ballot is recorded for ${candidates.find((candidate) => candidate.id === submittedCandidateId)?.name || 'the selected candidate'}.`
                      : 'Your ballot has been recorded successfully.'}
                  </p>
                </div>
              </div>
              <Button variant="secondary" className="md:w-auto">
                View live results
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="h-[280px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
    <div className="h-[164px] animate-pulse rounded-[1.4rem] border border-theme bg-elevated" />
    <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-[320px] animate-pulse rounded-[1.5rem] border border-theme bg-elevated" />
      ))}
    </div>
  </div>
);

const Pill = ({ icon, label, accent = false }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
      accent ? 'border-[color:var(--accent-2)]/30 bg-[color:var(--accent-2)]/12 text-[color:var(--accent-2)]' : 'border-theme bg-surface text-secondary-theme'
    }`}
  >
    {icon}
    {label}
  </span>
);

const MetricLine = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-theme bg-surface px-4 py-3">
    <span className="text-sm text-secondary-theme">{label}</span>
    <span className="text-sm font-medium text-primary-theme">{value}</span>
  </div>
);

export default Dashboard;
