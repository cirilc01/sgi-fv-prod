/**
 * SGI FV - Dashboard Page
 * Main dashboard with summary cards
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Placeholder data
  const stats = [
    { label: 'Processos em Andamento', value: 12, icon: FolderKanban, color: 'bg-blue-600' },
    { label: 'Pendentes', value: 5, icon: Clock, color: 'bg-yellow-600' },
    { label: 'Concluídos', value: 28, icon: CheckCircle2, color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Dashboard</h1>
        <p className="text-slate-400 text-sm font-bold mt-1">Visão geral do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-4xl font-black text-white mt-2">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/processos/1"
            className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-800 rounded-xl hover:bg-blue-900/30 transition-colors group"
          >
            <div>
              <p className="font-bold text-white">Abrir Processo Exemplo</p>
              <p className="text-slate-400 text-sm">Visualizar detalhes de um processo</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/processos/novo"
            className="flex items-center justify-between p-4 bg-emerald-900/20 border border-emerald-800 rounded-xl hover:bg-emerald-900/30 transition-colors group"
          >
            <div>
              <p className="font-bold text-white">Novo Processo</p>
              <p className="text-slate-400 text-sm">Criar um novo processo</p>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
