/**
 * SGI FV - Sidebar Component
 * Navigation menu for the SaaS layout
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Settings } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/processos', label: 'Processos', icon: FolderKanban },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/configuracoes/membros', label: 'Configurações', icon: Settings },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-black text-white tracking-tighter">SGI FV</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Formando Valores</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-slate-600 text-[10px] uppercase tracking-tighter text-center">
          © 2026 SGI FV
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
