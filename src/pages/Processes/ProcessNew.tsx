/**
 * SGI FV - New Process Page
 * Form for creating a new process
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

const ProcessNew: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic
    alert('Funcionalidade de criação ainda não implementada');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/processos"
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Novo Processo</h1>
          <p className="text-slate-400 text-sm font-bold mt-1">Preencha os dados do processo</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Cliente</label>
          <input
            type="text"
            placeholder="Nome do cliente"
            className="w-full bg-gray-900 border border-slate-800 rounded-xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Tipo de Processo</label>
          <select className="w-full bg-gray-900 border border-slate-800 rounded-xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Selecione o tipo</option>
            <option value="administrativo">Administrativo</option>
            <option value="judicial">Judicial</option>
            <option value="consultoria">Consultoria</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Status Inicial</label>
          <select className="w-full bg-gray-900 border border-slate-800 rounded-xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500">
            <option value="pendente">Pendente</option>
            <option value="triagem">Triagem</option>
            <option value="analise">Em Análise</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Observações</label>
          <textarea
            rows={4}
            placeholder="Digite as observações do processo..."
            className="w-full bg-gray-900 border border-slate-800 rounded-xl p-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Criar Processo
        </button>
      </form>
    </div>
  );
};

export default ProcessNew;
