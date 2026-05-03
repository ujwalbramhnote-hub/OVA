import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, BarChart3, FileText, UserCircle2, Settings, LogOut, Vote } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutGrid,
    to: '/dashboard',
    activePaths: ['/dashboard', '/voter/dashboard', '/candidate/dashboard', '/admin/dashboard']
  },
  { label: 'Live Results', icon: BarChart3, to: '/results', activePaths: ['/results'] },
  { label: 'Audit Log', icon: FileText, to: '/audit-log', activePaths: ['/audit-log'] },
  { label: 'My Profile', icon: UserCircle2, to: '/profile', activePaths: ['/profile'] },
  { label: 'Settings', icon: Settings, to: '/settings', activePaths: ['/settings'] }
];

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const content = (
    <Card className="flex h-full flex-col rounded-none border-0 border-r border-theme bg-surface shadow-none">
      <div className="border-b border-theme px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-theme bg-elevated text-accent-theme">
            <Vote size={20} />
          </div>
          <div>
            <p className="text-base font-semibold text-primary-theme">VoteChain</p>
            <p className="text-xs text-secondary-theme">Secure Ballot v2</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5">
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.activePaths?.some((path) => location.pathname === path || location.pathname.startsWith(path));

            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive: routeActive }) =>
                  cn(
                    'flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors',
                    routeActive || isActive
                      ? 'bg-elevated text-accent-hover-theme ring-1 ring-[color:var(--accent)]/30'
                      : 'text-secondary-theme hover:bg-elevated hover:text-primary-theme'
                  )
                }
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-theme p-4">
        <div className="rounded-[1.35rem] border border-theme bg-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent)]/12 text-accent-hover-theme">
              <UserCircle2 size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-primary-theme">{user?.name || 'Signed in user'}</p>
              <p className="truncate text-xs text-secondary-theme">{user?.email || 'Active session'}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-[0.22em] text-muted-theme">Session active</span>
            <Button variant="secondary" className="px-3 py-2 text-xs" onClick={logout}>
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:block md:w-[280px]">
        {content}
      </aside>

      <AnimatePresence>
        {open ? (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'tween', duration: 0.22 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] md:hidden"
          >
            {content}
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
