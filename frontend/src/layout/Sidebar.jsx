import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Vote, BarChart3, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const role = user?.role;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Results', icon: BarChart3, path: '/results' },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-0 md:w-20'} transition-all duration-300 bg-dark-900 text-white flex flex-col shadow-xl overflow-hidden`}>
      <div className="p-6 font-bold text-xl flex items-center gap-3">
        <div className="bg-primary-500 p-2 rounded-lg shrink-0"><Vote size={24} /></div>
        {isOpen && <span className="whitespace-nowrap">VoteChain</span>}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `flex items-center gap-4 p-3 rounded-xl transition-all ${
              isActive ? 'bg-primary-600 shadow-lg shadow-primary-500/30' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <item.icon size={20} className="shrink-0" />
            {isOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center gap-4 p-3 w-full text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} className="shrink-0" />
          {isOpen && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
