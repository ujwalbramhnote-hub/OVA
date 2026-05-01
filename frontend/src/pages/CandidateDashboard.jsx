import React, { useEffect, useState } from 'react';
import { Loader2, Megaphone, User, BadgeCheck, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../api/axios';

const CandidateDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/candidate/profile');
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching candidate profile', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>Loading candidate dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 text-white p-8 md:p-10 border border-white/10 shadow-2xl shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80 mb-3">Candidate Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-bold">Your campaign profile</h1>
        <p className="text-slate-300 mt-3 max-w-2xl">This view is private to candidates. It shows only your own profile and aggregate vote count.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard icon={<User size={22} />} label="Candidate" value={profile?.name || 'N/A'} />
        <StatCard icon={<BadgeCheck size={22} />} label="Party" value={profile?.party || 'N/A'} />
        <StatCard icon={<TrendingUp size={22} />} label="Total Votes" value={String(profile?.totalVotes ?? 0)} />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
      >
        <div className="h-40 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-20">
            <div className="flex items-end gap-5">
              <div className="w-28 h-28 rounded-[1.75rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl border-4 border-white dark:border-dark-800 overflow-hidden">
                {profile?.imageUrl ? (
                  <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <Megaphone size={42} />
                )}
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white">{profile?.name}</h2>
                <p className="text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-[0.2em] text-sm mt-1">{profile?.party}</p>
              </div>
            </div>
            <div className="px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Vote Count</p>
              <p className="text-3xl font-bold text-dark-900 dark:text-white mt-1">{profile?.totalVotes ?? 0}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard label="Description" value={profile?.description || 'No description provided.'} />
            <InfoCard label="Manifesto" value={profile?.manifesto || 'No manifesto provided.'} />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
    <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-300">{icon}</div>
    <div className="min-w-0">
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
      <h4 className="text-xl font-bold text-dark-900 dark:text-white truncate">{value}</h4>
    </div>
  </div>
);

const InfoCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-5">
    <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-3">{label}</p>
    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{value}</p>
  </div>
);

export default CandidateDashboard;
