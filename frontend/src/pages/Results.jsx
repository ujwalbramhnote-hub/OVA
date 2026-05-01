import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, Award, Loader2 } from 'lucide-react';
import axios from '../api/axios';

const Results = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ totalVotes: 0, leader: 'N/A', lead: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('/api/results');
      const chartData = response.data.map((candidate, index) => ({
        name: candidate.name,
        votes: candidate.totalVotes ?? 0,
        color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]
      }));

      const sorted = [...response.data].sort((a, b) => (b.totalVotes ?? 0) - (a.totalVotes ?? 0));
      const leadingCandidate = sorted[0]?.name || 'N/A';
      const totalVotes = response.data.reduce((sum, candidate) => sum + (candidate.totalVotes ?? 0), 0);

      setData(chartData);
      setStats({
        totalVotes,
        leader: leadingCandidate,
        lead: sorted.length > 1 ? (sorted[0].totalVotes ?? 0) - (sorted[1].totalVotes ?? 0) : 0
      });
    } catch (err) {
      console.error('Error fetching results', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center text-slate-400">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p>Fetching live results...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white transition-colors">Election Live Results</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Real-time data visualization of the current election cycle.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-blue-600" />} label="Registered Voters" value="N/A" sub="Live Sync" />
        <StatCard icon={<TrendingUp className="text-green-600" />} label="Total Votes Cast" value={stats.totalVotes.toString()} sub="Verified" />
        <StatCard icon={<Award className="text-amber-600" />} label="Current Leader" value={stats.leader} sub="Leading" />
      </div>

      <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
        <h3 className="text-lg font-bold mb-8 dark:text-white">Vote Distribution</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} stroke="#94a3b8" />
              <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="votes" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4 transition-colors">
    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-dark-900 dark:text-white my-1">{value}</h4>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{sub}</p>
    </div>
  </div>
);

export default Results;
