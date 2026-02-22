/**
 * SGI FV - Topbar Component
 * Action buttons and header for the SaaS layout
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, FileDown, LogOut } from 'lucide-react';
import { supabase } from '../../supabase';

interface TopbarProps {
  onLogout?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-end px-6 gap-2 no-print">
      <button
        onClick={handlePrint}
        title="Imprimir"
        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors flex items-center gap-2 px-4 text-xs font-bold uppercase"
      >
        <Printer className="w-4 h-4" /> Imprimir
      </button>
      <button
        onClick={handlePrint}
        title="Gerar PDF"
        className="p-2 bg-blue-900/40 hover:bg-blue-900/60 rounded-lg text-blue-300 transition-colors flex items-center gap-2 px-4 text-xs font-bold border border-blue-800 uppercase"
      >
        <FileDown className="w-4 h-4" /> Gerar PDF
      </button>
      <button
        onClick={handleLogout}
        className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded-lg text-red-400 transition-colors flex items-center gap-2 px-4 text-xs font-bold uppercase"
      >
        <LogOut className="w-4 h-4" /> Sair
      </button>
    </header>
  );
};

export default Topbar;
