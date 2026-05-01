import React, { useMemo, useState } from 'react';
import { User, Mail, Lock, Calendar, ArrowRight, ShieldCheck, Megaphone, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEFAULT_ROLE = 'VOTER';

const Register = () => {
  const navigate = useNavigate();
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

  const { register } = useAuth();

  const isCandidate = useMemo(() => formData.role === 'CANDIDATE', [formData.role]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(135deg,_#081120,_#0f172a_55%,_#111827)] p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-8 md:p-10 rounded-[2rem] shadow-2xl text-white"
      >
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80 mb-3">Online Voting Application</p>
          <h1 className="text-3xl md:text-4xl font-bold">Create your account</h1>
          <p className="text-slate-300 mt-3">Register as a voter or candidate. Admin accounts are not public.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup icon={<User size={18} />} name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <InputGroup icon={<Mail size={18} />} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup icon={<Calendar size={18} />} name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-300 transition-colors">
                <ShieldCheck size={18} />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all text-white"
              >
                <option value="VOTER" className="text-slate-900">Voter</option>
                <option value="CANDIDATE" className="text-slate-900">Candidate</option>
              </select>
            </div>
          </div>

          <InputGroup icon={<Lock size={18} />} name="password" type="password" placeholder="Create Password" value={formData.password} onChange={handleChange} required />

          {isCandidate && (
            <div className="space-y-4 rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="flex items-center gap-2 text-cyan-200 font-semibold">
                <Megaphone size={18} />
                Candidate profile
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup icon={<ShieldCheck size={18} />} name="party" type="text" placeholder="Party / Alliance" value={formData.party} onChange={handleChange} required />
                <InputGroup icon={<Image size={18} />} name="imageUrl" type="url" placeholder="Image URL (optional)" value={formData.imageUrl} onChange={handleChange} />
              </div>
              <TextAreaGroup
                icon={<User size={18} />}
                name="description"
                placeholder="Short profile description"
                value={formData.description}
                onChange={handleChange}
              />
              <TextAreaGroup
                icon={<Megaphone size={18} />}
                name="manifesto"
                placeholder="Manifesto / campaign statement"
                value={formData.manifesto}
                onChange={handleChange}
              />
            </div>
          )}

          <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-4 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group mt-6">
            Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-300">
          Already have an account?{' '}
          <button
            type="button"
            className="text-cyan-300 font-bold hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-300 transition-colors">
      {icon}
    </div>
    <input
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all text-white placeholder:text-slate-400"
    />
  </div>
);

const TextAreaGroup = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-cyan-300 transition-colors">
      {icon}
    </div>
    <textarea
      {...props}
      rows="3"
      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all text-white placeholder:text-slate-400 resize-none"
    />
  </div>
);

export default Register;
