import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', age: '', phone: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Account created! Please login.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-900 p-4 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-lg bg-white dark:bg-dark-800 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Join the future of digital voting.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputGroup icon={<User size={18}/>} name="name" type="text" placeholder="Full Name" onChange={handleChange} required />
          <InputGroup icon={<Mail size={18}/>} name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup icon={<Calendar size={18}/>} name="age" type="number" placeholder="Age" onChange={handleChange} required />
            <InputGroup icon={<Phone size={18}/>} name="phone" type="text" placeholder="Phone" onChange={handleChange} required />
          </div>
          <InputGroup icon={<Lock size={18}/>} name="password" type="password" placeholder="Create Password" onChange={handleChange} required />

          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 group mt-4">
            Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already have an account? <a className="text-primary-600 font-bold hover:underline cursor-pointer" onClick={() => navigate('/login')}>Sign In</a>
        </p>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
      {icon}
    </div>
    <input 
      {...props}
      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white"
    />
  </div>
);

export default Register;
