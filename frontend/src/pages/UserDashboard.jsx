import React, { useState, useEffect } from 'react';
import { CheckCircle2, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setCandidates([
        { id: 1, name: 'Candidate A', party: 'Alpha Party', bio: 'Visionary leadership for a digital future.' },
        { id: 2, name: 'Candidate B', party: 'Beta Union', bio: 'Sustainable growth and community focus.' },
        { id: 3, name: 'Candidate C', party: 'Gamma Group', bio: 'Economic stability and innovation.' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVote = (id) => {
    if (window.confirm('Are you sure you want to cast your vote?')) {
      setVoted(true);
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center text-slate-400">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p>Fetching candidates...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Cast Your Vote</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Every vote counts towards a better future. Choose wisely.</p>
      </header>

      {voted ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-10 rounded-3xl text-center"
        >
          <div className="bg-green-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-400 mb-2">Thank you for voting!</h2>
          <p className="text-green-700 dark:text-green-500 text-lg">Your participation strengthens our democracy.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <motion.div 
              key={candidate.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-dark-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col"
            >
              <div className="bg-primary-50 dark:bg-primary-900/30 w-16 h-16 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <User size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark-900 dark:text-white">{candidate.name}</h3>
              <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm mb-4 uppercase tracking-wider">{candidate.party}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-1 italic leading-relaxed">"{candidate.bio}"</p>
              <button 
                onClick={() => handleVote(candidate.id)}
                className="w-full bg-dark-900 dark:bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/10"
              >
                Select Candidate
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

