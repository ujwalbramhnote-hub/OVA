import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Upload, User, BadgeCheck, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { resolveImageSrc } from '../utils/image';
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';

const CandidateDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return undefined;
    }
    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextPreviewUrl);
    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [selectedFile]);

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

  const handleFileChange = (event) => {
    setUploadError('');
    setSelectedFile(event.target.files?.[0] || null);
  };

  const uploadProfileImage = async () => {
    if (!selectedFile || !profile?.candidateId) {
      setUploadError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      setUploadError('');
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/candidate/upload-image/${profile.candidateId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = response.data?.imageUrl;
      if (imageUrl) {
        setProfile((current) => ({ ...current, profileImageUrl: imageUrl, imageUrl }));
      }
      setSelectedFile(null);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <CandidateSkeleton />;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <motion.section variants={slideUp} className="overflow-hidden rounded-[1.75rem] border border-theme bg-elevated">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 md:p-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-1 text-xs font-medium text-accent-hover-theme">
              <Sparkles size={14} />
              Candidate dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary-theme md:text-4xl">
              Your campaign profile
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary-theme md:text-base">
              Update your public image, review your ballot count, and keep the profile presentation consistent with the new gold-accent dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Pill icon={<ShieldCheck size={14} />} label="Private candidate view" />
              <Pill icon={<TrendingUp size={14} />} label={`Votes: ${profile?.totalVotes ?? 0}`} accent />
            </div>
          </div>

          <div className="border-t border-theme bg-surface p-6 lg:border-l lg:border-t-0">
            <div className="rounded-[1.35rem] border border-theme bg-elevated p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">Profile snapshot</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-theme bg-surface">
                  <img
                    src={resolveImageSrc(profile?.profileImageUrl || profile?.imageUrl)}
                    alt={profile?.name || 'Candidate'}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-primary-theme">{profile?.name || 'N/A'}</p>
                  <p className="truncate text-sm text-secondary-theme">{profile?.party || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <MetricLine label="Votes" value={profile?.totalVotes ?? 0} />
                <MetricLine label="Candidate ID" value={profile?.candidateId ?? 'N/A'} />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon={<User size={18} />} label="Candidate" value={profile?.name || 'N/A'} />
        <StatCard icon={<BadgeCheck size={18} />} label="Party" value={profile?.party || 'N/A'} />
        <StatCard icon={<TrendingUp size={18} />} label="Total votes" value={String(profile?.totalVotes ?? 0)} accent />
      </motion.div>

      <motion.section variants={slideUp}>
        <Card className="p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary-theme">Profile image</h2>
              <p className="mt-1 text-sm text-secondary-theme">Upload a new profile image without affecting your account or vote record.</p>
            </div>
            <div className="text-sm text-muted-theme">Preferred: square image, neutral background</div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-primary-theme">Select file</span>
              <input
                type="file"
                accept=".jpg,.png,image/jpeg,image/png"
                onChange={handleFileChange}
                className="block w-full rounded-xl border border-theme bg-elevated px-4 py-3 text-sm text-secondary-theme file:mr-4 file:rounded-lg file:border-0 file:bg-accent-theme file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#111318] hover:file:bg-accent-hover-theme"
              />
            </label>

            <Button type="button" onClick={uploadProfileImage} disabled={!selectedFile || uploading} className="min-w-[180px] py-3.5">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? 'Uploading...' : 'Upload image'}
            </Button>
          </div>

          {uploadError ? <div className="mt-4 rounded-xl border border-[#8C4E4E] bg-[#2A1717] px-4 py-3 text-sm text-accent-hover-theme">{uploadError}</div> : null}

          {selectedFile ? (
            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-theme bg-elevated p-4">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-theme bg-surface">
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-primary-theme">Preview before upload</p>
                <p className="text-sm text-secondary-theme">{selectedFile.name}</p>
              </div>
            </div>
          ) : null}
        </Card>
      </motion.section>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <motion.div variants={slideUp}>
          <InfoCard label="Description" value={profile?.description || 'No description provided.'} />
        </motion.div>
        <motion.div variants={slideUp}>
          <InfoCard label="Manifesto" value={profile?.manifesto || 'No manifesto provided.'} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const CandidateSkeleton = () => (
  <div className="space-y-6">
    <div className="h-[240px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-[126px] animate-pulse rounded-[1.5rem] border border-theme bg-elevated" />
      ))}
    </div>
    <div className="h-[220px] animate-pulse rounded-[1.75rem] border border-theme bg-elevated" />
    <div className="grid gap-4 md:grid-cols-2">
      <div className="h-[160px] animate-pulse rounded-[1.5rem] border border-theme bg-elevated" />
      <div className="h-[160px] animate-pulse rounded-[1.5rem] border border-theme bg-elevated" />
    </div>
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

const InfoCard = ({ label, value }) => (
  <Card className="p-5">
    <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">{label}</p>
    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-secondary-theme">{value}</p>
  </Card>
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

export default CandidateDashboard;
