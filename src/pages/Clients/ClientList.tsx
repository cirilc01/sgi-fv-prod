/**
 * SGI FV - Client List Page
 * List of all clients
 */

import React from 'react';
import { Users, Search, UserPlus } from 'lucide-react';

const ClientList: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Users className="text-purple-500" /> Clientes
          </h1>
          <p className="text-slate-400 text-sm font-bold mt-1">Gerenciamento de clientes</p>
        </div>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg">
          <UserPlus className="w-5 h-5" /> Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar cliente..."
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-slate-800 rounded-xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Nenhum cliente cadastrado</h3>
        <p className="text-slate-400 text-sm mb-6">Comece adicionando seu primeiro cliente ao sistema.</p>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl inline-flex items-center gap-2 transition-colors">
          <UserPlus className="w-5 h-5" /> Adicionar Cliente
        </button>
      </div>
    </div>
  );
};

export default ClientList;
