import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Shield, Users, Vote, Trash2, Sparkles, BarChart3, BadgeCheck } from 'lucide-react';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { resolveImageSrc } from '../utils/image';
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, candidatesRes, resultsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/candidates'),
        axios.get('/api/admin/results')
      ]);
      setUsers(usersRes.data || []);
      setCandidates(candidatesRes.data || []);
      setResults(resultsRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers((current) => current.filter((user) => user.id !== id));
    } catch {
      alert('Failed to delete user');
    }
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await axios.delete(`/api/admin/candidates/${id}`);
      setCandidates((current) => current.filter((candidate) => candidate.id !== id));
    } catch {
      alert('Failed to delete candidate');
    }
  };

  const overview = useMemo(() => {
    const totalVotes = results.reduce((sum, candidate) => sum + (candidate.totalVotes ?? 0), 0);
    const leader = [...results].sort((a, b) => (b.totalVotes ?? 0) - (a.totalVotes ?? 0))[0] || null;
    return { totalVotes, leader };
  }, [results]);

  if (loading) return <AdminSkeleton />;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <motion.section variants={slideUp} className="overflow-hidden rounded-[1.75rem] border border-theme bg-elevated">
        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="p-6 md:p-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-1 text-xs font-medium text-accent-hover-theme">
              <Sparkles size={14} />
              Admin control center
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary-theme md:text-4xl">
              Admin Console
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary-theme md:text-base">
              Monitor users, candidates, and aggregate results in a consistent dark dashboard with gold-accent emphasis.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Pill icon={<Shield size={14} />} label="Protected control surface" />
              <Pill icon={<BarChart3 size={14} />} label={`Votes: ${overview.totalVotes}`} accent />
            </div>
          </div>

          <div className="border-t border-theme bg-surface p-6 lg:border-l lg:border-t-0">
            <div className="rounded-[1.35rem] border border-theme bg-elevated p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">System summary</p>
              <div className="mt-5 space-y-3">
                <MetricLine label="Registered users" value={users.length} />
                <MetricLine label="Candidates" value={candidates.length} />
                <MetricLine label="Leading candidate" value={overview.leader?.name || 'N/A'} />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Users size={18} />} label="Users" value={String(users.length)} />
        <StatCard icon={<Vote size={18} />} label="Candidates" value={String(candidates.length)} />
        <StatCard icon={<BadgeCheck size={18} />} label="Votes cast" value={String(overview.totalVotes)} accent />
        <StatCard icon={<BarChart3 size={18} />} label="Leader" value={overview.leader?.name || 'N/A'} />
      </motion.div>

      <motion.section variants={slideUp}>
        <Card className="overflow-hidden">
          <div className="flex flex-col border-b border-theme md:flex-row">
            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="Users" />
            <TabButton active={activeTab === 'candidates'} onClick={() => setActiveTab('candidates')} icon={<Vote size={18} />} label="Candidates" />
          </div>

          <div className="p-5 md:p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'users' ? (
                <motion.div key="users-table" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-theme text-xs uppercase tracking-[0.22em] text-muted-theme">
                        <th className="px-4 pb-4 font-semibold">Name</th>
                        <th className="px-4 pb-4 font-semibold">Email</th>
                        <th className="px-4 pb-4 font-semibold">Age</th>
                        <th className="px-4 pb-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <motion.tr key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: index * 0.03 }} className="border-b border-theme text-primary-theme hover:bg-surface">
                          <td className="px-4 py-4">{user.name}</td>
                          <td className="px-4 py-4 text-secondary-theme">{user.email}</td>
                          <td className="px-4 py-4 text-secondary-theme">{user.age}</td>
                          <td className="px-4 py-4">
                            <Button variant="ghost" className="px-3 py-2 text-[#E5A3A3]" onClick={() => deleteUser(user.id)}>
                              <Trash2 size={16} />
                              Remove
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <motion.div key="candidates-table" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-theme text-xs uppercase tracking-[0.22em] text-muted-theme">
                        <th className="px-4 pb-4 font-semibold">Image</th>
                        <th className="px-4 pb-4 font-semibold">Name</th>
                        <th className="px-4 pb-4 font-semibold">Party</th>
                        <th className="px-4 pb-4 font-semibold">Votes</th>
                        <th className="px-4 pb-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate, index) => {
                        const voteCount = results.find((entry) => entry.name === candidate.name)?.totalVotes ?? 0;
                        return (
                          <motion.tr key={candidate.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: index * 0.03 }} className="border-b border-theme text-primary-theme hover:bg-surface">
                            <td className="px-4 py-4">
                              <div className="h-12 w-12 overflow-hidden rounded-2xl border border-theme bg-surface">
                                <img src={resolveImageSrc(candidate.profileImageUrl || candidate.imageUrl)} alt={candidate.name} className="h-full w-full object-cover" />
                              </div>
                            </td>
                            <td className="px-4 py-4">{candidate.name}</td>
                            <td className="px-4 py-4 text-secondary-theme">{candidate.party}</td>
                            <td className="px-4 py-4 text-accent-hover-theme">{voteCount}</td>
                            <td className="px-4 py-4">
                              <Button variant="ghost" className="px-3 py-2 text-[#E5A3A3]" onClick={() => deleteCandidate(candidate.id)}>
                                <Trash2 size={16} />
                                Remove
                              </Button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
};

const AdminSkeleton = () => (
  <div className="space-y-6">
    <div className="h-[220px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-[126px] animate-pulse rounded-[1.5rem] border border-theme bg-elevated" />
      ))}
    </div>
    <div className="h-[420px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
  </div>
);

const StatCard = ({ icon, label, value, accent = false }) => (
  <Card className={`p-5 ${accent ? 'border-[color:var(--accent)]/30' : ''}`}>
    <div className="flex items-start gap-3">
      <div className={`rounded-xl p-2.5 ${accent ? 'bg-[color:var(--accent)]/12 text-accent-hover-theme' : 'bg-surface text-secondary-theme'}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">{label}</p>
        <p className="mt-2 text-lg font-semibold text-primary-theme">{value}</p>
      </div>
    </div>
  </Card>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-colors md:px-8 ${
      active ? 'border-[color:var(--accent)] text-accent-hover-theme' : 'border-transparent text-secondary-theme hover:text-primary-theme'
    }`}
  >
    {icon}
    {label}
  </motion.button>
);

const Pill = ({ icon, label, accent = false }) => (
  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${accent ? 'border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 text-accent-hover-theme' : 'border-theme bg-surface text-secondary-theme'}`}>
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

export default AdminDashboard;
