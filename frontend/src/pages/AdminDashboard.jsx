import React, { useState, useEffect } from 'react';
import { Users, Vote, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../api/axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, candidatesRes, resultsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/candidates'),
        axios.get('/api/admin/results')
      ]);
      setUsers(usersRes.data);
      setCandidates(candidatesRes.data);
      setResults(resultsRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const deleteCandidate = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await axios.delete(`/api/admin/candidates/${id}`);
        setCandidates(candidates.filter(candidate => candidate.id !== id));
      } catch (err) {
        alert('Failed to delete candidate');
      }
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center text-slate-400">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p>Loading admin console...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Admin Console</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage users, monitor aggregate vote counts, and oversee system integrity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {results.map((candidate) => (
          <StatCard
            key={candidate.candidateId}
            label={candidate.name}
            value={candidate.totalVotes ?? 0}
            color="bg-primary-500"
            subLabel={candidate.party}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 dark:border-slate-700">
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18}/>} label="Users" />
          <TabButton active={activeTab === 'candidates'} onClick={() => setActiveTab('candidates')} icon={<Vote size={18}/>} label="Candidates" />
        </div>

        <div className="p-6">
          {activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm uppercase tracking-wider">
                    <th className="pb-4 font-semibold">Name</th>
                    <th className="pb-4 font-semibold">Email</th>
                    <th className="pb-4 font-semibold">Age</th>
                    <th className="pb-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {users.map(user => (
                    <tr key={user.id} className="text-dark-900 dark:text-slate-300">
                      <td className="py-4">{user.name}</td>
                      <td className="py-4">{user.email}</td>
                      <td className="py-4">{user.age}</td>
                      <td className="py-4">
                        <button onClick={() => deleteUser(user.id)} className="text-rose-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm uppercase tracking-wider">
                    <th className="pb-4 font-semibold">Name</th>
                    <th className="pb-4 font-semibold">Party</th>
                    <th className="pb-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {candidates.map(candidate => (
                    <tr key={candidate.id} className="text-dark-900 dark:text-slate-300">
                      <td className="py-4">{candidate.name}</td>
                      <td className="py-4">{candidate.party}</td>
                      <td className="py-4">
                        <button onClick={() => deleteCandidate(candidate.id)} className="text-rose-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  </div>
);
};

const StatCard = ({ label, value, color, subLabel }) => (
  <div className="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
    <div className="flex items-end gap-3 mt-1">
      <h4 className="text-3xl font-bold text-dark-900 dark:text-white">{value}</h4>
      <div className={`h-2 w-12 rounded-full mb-2 ${color}`} />
    </div>
    {subLabel && <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider">{subLabel}</p>}
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-8 py-4 font-bold transition-all border-b-2 ${
      active 
      ? 'border-primary-600 text-primary-600 bg-primary-50/30' 
      : 'border-transparent text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default AdminDashboard;
