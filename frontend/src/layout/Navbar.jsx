import React from 'react';
import { Search, Bell, Moon, Sun, UserCircle, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const normalizeRole = (role) => {
  switch (role) {
    case 'ROLE_ADMIN':
    case 'ADMIN':
      return 'ADMIN';
    case 'ROLE_CANDIDATE':
    case 'CANDIDATE':
      return 'CANDIDATE';
    case 'ROLE_USER':
    case 'ROLE_VOTER':
    case 'VOTER':
    default:
      return 'VOTER';
  }
};

const Navbar = ({ toggleSidebar }) => {
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const role = normalizeRole(user?.role);

  return (
    <nav className="h-20 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden p-2 text-slate-600 dark:text-slate-400">
           <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl w-96">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder="Search elections..." className="bg-transparent outline-none text-sm w-full dark:text-white" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="relative">
          <Bell size={20} className="text-slate-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark-900"></span>
        </div>
        <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold dark:text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400">
              {role === 'ADMIN' ? 'Administrator' : role === 'CANDIDATE' ? 'Candidate' : 'Voter'}
            </p>
          </div>
          <UserCircle size={36} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
