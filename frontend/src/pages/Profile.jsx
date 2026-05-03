import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, CalendarDays, Mail, ShieldCheck, Sparkles, Trophy, User, Vote } from 'lucide-react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { readPreferences } from '../utils/preferences';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';
import { resolveImageSrc } from '../utils/image';

const Profile = () => {
  const { user, logout } = useAuth();
  const [account, setAccount] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const prefs = readPreferences();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const [meRes, userProfileRes, candidateRes] = await Promise.allSettled([
          axios.get('/api/auth/me'),
          axios.get('/api/user/profile'),
          axios.get('/api/candidate/profile')
        ]);

        if (!mounted) return;

        if (meRes.status === 'fulfilled') setAccount(meRes.value.data);
        if (userProfileRes.status === 'fulfilled') setUserProfile(userProfileRes.value.data);
        if (candidateRes.status === 'fulfilled') setCandidateProfile(candidateRes.value.data);
      } catch {
        // handled by settled calls
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const roleLabel = useMemo(() => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Administrator';
      case 'CANDIDATE':
        return 'Candidate';
      default:
        return 'Voter';
    }
  }, [user?.role]);

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <motion.section variants={slideUp} className="rounded-[1.75rem] border border-theme bg-elevated p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-1 text-xs font-medium text-accent-hover-theme">
              <Sparkles size={14} />
              Account profile
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary-theme md:text-4xl">
              My Profile
            </h1>
            <p className="mt-3 text-sm leading-6 text-secondary-theme md:text-base">
              Review the authenticated account data and role-specific profile information from the live session.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Pill icon={<ShieldCheck size={14} />} label={roleLabel} accent />
            <Pill icon={<Vote size={14} />} label={account?.hasVoted ? 'Voted' : 'Not voted'} />
          </div>
        </div>
      </motion.section>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <motion.section variants={slideUp}>
          <Card className="overflow-hidden">
            <div className="border-b border-theme p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.5rem] border border-theme bg-surface">
                  <span className="text-2xl font-semibold text-accent-theme">
                    {(account?.name || user?.name || 'VC')
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">Authenticated user</p>
                  <h2 className="mt-2 text-2xl font-semibold text-primary-theme">{account?.name || user?.name || 'User'}</h2>
                  <p className="mt-1 text-sm text-secondary-theme">
                    {prefs.showEmail ? (account?.email || user?.email || 'No email available') : 'Email hidden in settings'}
                  </p>
                </div>
                <div className="rounded-2xl border border-theme bg-surface px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">Role</p>
                  <p className="mt-2 text-sm font-semibold text-primary-theme">{roleLabel}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
              <ProfileStat
                icon={<Mail size={16} />}
                label="Email"
                value={prefs.showEmail ? (account?.email || user?.email || 'N/A') : 'Hidden'}
              />
              <ProfileStat icon={<CalendarDays size={16} />} label="Age" value={account?.age ?? 'N/A'} />
              <ProfileStat icon={<Trophy size={16} />} label="Status" value={account?.hasVoted ? 'Vote recorded' : 'Waiting to vote'} />
              <ProfileStat icon={<BadgeCheck size={16} />} label="Session" value="Active" />
            </div>
          </Card>
        </motion.section>

        <motion.section variants={slideUp}>
          <Card className="p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">Quick facts</p>
            <div className="mt-4 space-y-3">
              <FactRow label="Role" value={roleLabel} />
              <FactRow label="Vote status" value={account?.hasVoted ? 'Completed' : 'Pending'} />
              <FactRow label="Registered as" value={account?.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'Current account'} />
            </div>

            {candidateProfile ? (
              <div className="mt-6 rounded-[1.35rem] border border-theme bg-surface p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">Candidate details</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-theme bg-elevated">
                    <img
                      src={resolveImageSrc(candidateProfile.profileImageUrl || candidateProfile.imageUrl)}
                      alt={candidateProfile.name || 'Candidate'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-primary-theme">{candidateProfile.name}</p>
                    <p className="truncate text-sm text-secondary-theme">{candidateProfile.party}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-secondary-theme">{candidateProfile.description || 'No description provided.'}</p>
              </div>
            ) : null}
          </Card>
        </motion.section>
      </motion.div>

      <motion.section variants={slideUp}>
        <Card className="p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary-theme">Account actions</h2>
              <p className="mt-1 text-sm text-secondary-theme">Use these controls to manage the active session.</p>
            </div>
            <Button variant="secondary" onClick={logout}>
              Sign out
            </Button>
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
};

const ProfileStat = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-theme bg-elevated p-4">
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-[color:var(--accent)]/12 p-2 text-accent-hover-theme">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">{label}</p>
        <p className="mt-2 text-sm font-semibold text-primary-theme">{value}</p>
      </div>
    </div>
  </div>
);

const FactRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-theme bg-elevated px-4 py-3">
    <span className="text-sm text-secondary-theme">{label}</span>
    <span className="text-sm font-medium text-primary-theme">{value}</span>
  </div>
);

const Pill = ({ icon, label, accent = false }) => (
  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${accent ? 'border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 text-accent-hover-theme' : 'border-theme bg-surface text-secondary-theme'}`}>
    {icon}
    {label}
  </span>
);

export default Profile;
