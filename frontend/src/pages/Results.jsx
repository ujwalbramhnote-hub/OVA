import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, Award } from 'lucide-react';

const data = [
  { name: 'Candidate A', votes: 450, color: '#6366f1' },
  { name: 'Candidate B', votes: 320, color: '#10b981' },
  { name: 'Candidate C', votes: 280, color: '#f59e0b' },
];

const Results = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white transition-colors">Election Live Results</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Real-time data visualization of the current election cycle.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-blue-600" />} label="Total Voters" value="1,200" sub="Registered" />
        <StatCard icon={<TrendingUp className="text-green-600" />} label="Total Votes" value="1,050" sub="87% Turnout" />
        <StatCard icon={<Award className="text-amber-600" />} label="Leader" value="Candidate A" sub="+130 votes lead" />
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
