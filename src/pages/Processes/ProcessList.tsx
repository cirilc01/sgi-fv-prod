/**
 * SGI FV - Process List Page
 * List of all processes with search and filters
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, FolderKanban } from 'lucide-react';

const ProcessList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder data
  const processes = [
    { id: '1', protocol: 'SGI-2026-001', client: 'João Silva', status: 'Em Análise', date: '15/02/2026' },
    { id: '2', protocol: 'SGI-2026-002', client: 'Maria Santos', status: 'Pendente', date: '14/02/2026' },
    { id: '3', protocol: 'SGI-2026-003', client: 'Carlos Lima', status: 'Concluído', date: '10/02/2026' },
  ];

  const filteredProcesses = processes.filter(
    (p) =>
      p.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <FolderKanban className="text-blue-500" /> Processos
          </h1>
          <p className="text-slate-400 text-sm font-bold mt-1">Gerenciamento de processos</p>
        </div>
        <Link
          to="/processos/novo"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" /> Novo Processo
        </Link>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar por protocolo ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-slate-800 rounded-xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                <th className="px-6 py-4">Protocolo</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProcesses.map((process) => (
                <tr key={process.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-md text-[10px] font-black">
                      {process.protocol}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-200">{process.client}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black text-white ${
                        process.status === 'Pendente'
                          ? 'bg-yellow-600'
                          : process.status === 'Em Análise'
                          ? 'bg-orange-600'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {process.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-bold">{process.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/processos/${process.id}`}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 inline-flex"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProcessList;
