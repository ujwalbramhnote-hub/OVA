import React from 'react';
import { Bell, ChevronRight, Menu, RefreshCw, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const routeLabels = {
  '/dashboard': 'Dashboard',
  '/voter/dashboard': 'Dashboard',
  '/candidate/dashboard': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/results': 'Live Results',
  '/audit-log': 'Audit Log',
  '/profile': 'My Profile',
  '/settings': 'Settings'
};

const Topbar = ({ onMenuToggle, onRefresh }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const pageLabel = routeLabels[location.pathname] || 'Dashboard';

  const initials = (user?.name || 'VC')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-theme bg-app/95 backdrop-blur-md">
      <div className="flex min-h-[72px] items-center gap-4 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-theme bg-elevated text-primary-theme md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm text-secondary-theme">
            <span>VoteChain</span>
            <ChevronRight size={14} />
            <span className="text-primary-theme">{pageLabel}</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-theme bg-elevated px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-secondary-theme">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <motion.span
                animate={{ scale: [1, 1.35, 1], opacity: [0.75, 0.35, 0.75] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute h-2.5 w-2.5 rounded-full bg-[color:var(--success)]"
              />
            </span>
            Election live
          </div>
        </div>

        <div className="hidden w-[320px] lg:block">
          <Input placeholder="Search elections, candidates, audit events" leftIcon={<Search size={16} />} />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="secondary" onClick={onRefresh} className="px-4">
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button variant="secondary" onClick={toggleTheme} className="px-4">
            {darkMode ? 'Light mode' : 'Dark mode'}
          </Button>
          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-theme bg-elevated text-secondary-theme"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-theme" />
          </button>
          <div className="flex items-center gap-3 rounded-2xl border border-theme bg-elevated px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--accent)]/12 text-xs font-semibold text-accent-hover-theme">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-primary-theme">{user?.name || 'User'}</p>
              <p className="text-xs text-secondary-theme">Authenticated</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
