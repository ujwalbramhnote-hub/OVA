import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Calendar, Image, Lock, Mail, Megaphone, ShieldCheck, User, Users, Vote } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ElectionTicker from '../components/election/ElectionTicker';

const DEFAULT_ROLE = 'VOTER';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    role: DEFAULT_ROLE,
    party: '',
    description: '',
    manifesto: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isCandidate = useMemo(() => formData.role === 'CANDIDATE', [formData.role]);
  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-app relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_color-mix(in_srgb,var(--accent)_11%,transparent),_transparent_28%),radial-gradient(circle_at_bottom_right,_color-mix(in_srgb,var(--accent-2)_11%,transparent),_transparent_24%)]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_0.92fr]"
      >
        <Card className="p-6 md:p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-accent-hover-theme">VoteChain</p>
            <h1 className="mt-3 text-3xl font-semibold text-primary-theme">Create account</h1>
            <p className="mt-2 text-sm leading-6 text-secondary-theme">Register as a voter or candidate. Admin registration remains disabled.</p>
          </div>

          {error ? <div className="mb-5 rounded-xl border border-[#8C4E4E] bg-[#2A1717] px-4 py-3 text-sm text-accent-hover-theme">{error}</div> : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full name" name="name" value={formData.name} onChange={handleChange} leftIcon={<User size={16} />} required />
              <Input label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} leftIcon={<Mail size={16} />} required />
              <Input label="Age" type="number" name="age" value={formData.age} onChange={handleChange} leftIcon={<Calendar size={16} />} required />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-primary-theme">Role</span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-theme">
                    <ShieldCheck size={16} />
                  </span>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-theme bg-elevated px-4 py-3 pl-10 text-sm text-primary-theme outline-none transition-colors focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-2)]/30"
                  >
                    <option value="VOTER">Voter</option>
                    <option value="CANDIDATE">Candidate</option>
                  </select>
                </div>
              </label>
            </div>

            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} leftIcon={<Lock size={16} />} required />

            {isCandidate ? (
              <div className="rounded-[1.4rem] border border-theme bg-surface p-4 md:p-5">
                <div className="mb-4 flex items-center gap-2 text-accent-hover-theme">
                  <Megaphone size={16} />
                  <span className="text-sm font-medium">Candidate profile</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Party / Alliance" name="party" value={formData.party} onChange={handleChange} leftIcon={<ShieldCheck size={16} />} required />
                  <Input label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} leftIcon={<Image size={16} />} />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <TextArea label="Short description" name="description" value={formData.description} onChange={handleChange} />
                  <TextArea label="Manifesto" name="manifesto" value={formData.manifesto} onChange={handleChange} />
                </div>
              </div>
            ) : null}

            <Button type="submit" className="mt-2 w-full py-3.5" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary-theme">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} className="text-accent-hover-theme hover:text-accent-theme">
              Sign in
            </button>
          </p>
        </Card>

        <Card className="overflow-hidden p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-theme">
            <Users size={14} />
            Election registration
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-primary-theme">Built for voters and campaigns.</h2>
          <p className="mt-2 text-sm leading-6 text-secondary-theme">
            Registration follows a clear flow so the public ballot, candidate profile, and campaign messaging stay easy to understand.
          </p>

          <div className="mt-6 space-y-3">
            <InfoRow icon={<Vote size={15} />} title="Vote-ready accounts" text="A voter profile is enough to participate in the election." />
            <InfoRow icon={<Megaphone size={15} />} title="Candidate promotion" text="Campaign details and manifestos are surfaced in the dashboard cards." />
            <InfoRow icon={<ShieldCheck size={15} />} title="Role-based access" text="The registration flow respects voter and candidate permissions." />
          </div>

          <div className="mt-6">
            <ElectionTicker
              label="Campaign highlights"
              items={[
                { badge: 'Election ad', title: 'Be visible, be clear', detail: 'Simple public messaging helps voters compare candidates.', tone: 'gold' },
                { badge: 'Turnout', title: 'Participation changes results', detail: 'Election reminders help more people complete the ballot.', tone: 'blue' },
                { badge: 'Candidate lane', title: 'Profiles and manifestos stay readable', detail: 'Campaign information is presented without clutter.', tone: 'gold' }
              ]}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const InfoRow = ({ icon, title, text }) => (
  <div className="flex gap-3 rounded-2xl border border-theme bg-surface p-4">
    <div className="mt-0.5 rounded-xl bg-[color:var(--accent)]/12 p-2 text-accent-hover-theme">{icon}</div>
    <div>
      <p className="font-medium text-primary-theme">{title}</p>
      <p className="mt-1 text-sm leading-6 text-secondary-theme">{text}</p>
    </div>
  </div>
);

const TextArea = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-primary-theme">{label}</span>
    <textarea
      {...props}
      rows={4}
      className="w-full resize-none rounded-xl border border-theme bg-elevated px-4 py-3 text-sm text-primary-theme outline-none transition-colors placeholder:text-muted-theme focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-2)]/30"
    />
  </label>
);

export default Register;
