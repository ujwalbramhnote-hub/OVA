import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Megaphone, Vote } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ElectionTicker from '../components/election/ElectionTicker';

const normalizeRole = (role) => {
  switch (role) {
    case 'ROLE_ADMIN':
    case 'ADMIN':
      return 'ADMIN';
    case 'ROLE_CANDIDATE':
    case 'CANDIDATE':
      return 'CANDIDATE';
    default:
      return 'VOTER';
  }
};

const roleToDashboard = (role) => {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'CANDIDATE':
      return '/candidate/dashboard';
    default:
      return '/dashboard';
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = await login({ email, password });
      navigate(roleToDashboard(auth.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-app relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--accent)_12%,transparent),_transparent_32%),radial-gradient(circle_at_bottom_right,_color-mix(in_srgb,var(--accent-2)_12%,transparent),_transparent_28%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_0.86fr]"
      >
        <Card className="p-6 md:p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-accent-hover-theme">VoteChain</p>
            <h1 className="mt-3 text-3xl font-semibold text-primary-theme">Sign in</h1>
            <p className="mt-2 text-sm leading-6 text-secondary-theme">Access the secure ballot dashboard with your existing account.</p>
          </div>

          {error ? <div className="mb-5 rounded-xl border border-[#8C4E4E] bg-[#2A1717] px-4 py-3 text-sm text-accent-hover-theme">{error}</div> : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              required
            />

            <Button type="submit" className="mt-2 w-full py-3.5" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary-theme">
            New here?{' '}
            <button type="button" onClick={() => navigate('/register')} className="text-accent-hover-theme hover:text-accent-theme">
              Create an account
            </button>
          </p>
        </Card>

        <Card className="overflow-hidden p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-theme">
            <Megaphone size={14} />
            Election desk
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-primary-theme">Campaign messages, not noise.</h2>
          <p className="mt-2 text-sm leading-6 text-secondary-theme">
            VoteChain keeps the election story readable with live updates, secure access, and carefully paced campaign promotion.
          </p>

          <div className="mt-6 space-y-3">
            <InfoRow icon={<ShieldCheck size={15} />} title="Secure sign-in" text="Your session stays isolated behind JWT authentication." />
            <InfoRow icon={<Vote size={15} />} title="Public ballot flow" text="Vote submission is immediate and reflected in the live results screen." />
            <InfoRow icon={<Megaphone size={15} />} title="Campaign visibility" text="Advertising-style election updates keep turnout messaging visible." />
          </div>

          <div className="mt-6">
            <ElectionTicker
              label="Campaign highlights"
              items={[
                { badge: 'Election ad', title: 'Vote early, vote once', detail: 'A single ballot creates the official result.', tone: 'gold' },
                { badge: 'Turnout', title: 'Reminders drive participation', detail: 'Clear campaign messaging improves public response.', tone: 'blue' },
                { badge: 'Secure access', title: 'Authentication stays protected', detail: 'Only verified users can enter the dashboard.', tone: 'gold' }
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

export default Login;
