/**
 * SGI FV - Processes API Module
 * Database operations for processes and events
 */

import { supabase } from '../../supabase';

export interface Process {
  id: string;
  org_id: string;
  titulo: string;
  protocolo: string | null;
  status: 'cadastro' | 'triagem' | 'analise' | 'concluido';
  cliente_nome: string | null;
  cliente_documento: string | null;
  cliente_contato: string | null;
  responsavel_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProcessEvent {
  id: string;
  org_id: string;
  process_id: string;
  tipo: 'registro' | 'status_change' | 'observacao' | 'documento' | 'atribuicao';
  mensagem: string;
  created_by: string | null;
  created_at: string;
}

export interface CreateProcessPayload {
  titulo: string;
  cliente_nome?: string;
  cliente_documento?: string;
  cliente_contato?: string;
  responsavel_user_id?: string;
}

/**
 * Check if an error is a "relation does not exist" error
 */
function isTableNotFoundError(error: any): boolean {
  const message = error?.message || error?.details || '';
  return (
    message.includes('relation') && message.includes('does not exist') ||
    message.includes('42P01') || // PostgreSQL error code for undefined_table
    error?.code === '42P01'
  );
}

/**
 * List all processes for an organization
 */
export async function listProcesses(org_id: string): Promise<Process[]> {
  try {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .eq('org_id', org_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error listing processes:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (isTableNotFoundError(error)) {
        console.warn('⚠️ Tabela "processes" não existe. Execute as migrações SQL primeiro.');
      }
      
      return []; // Return empty array instead of throwing
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error in listProcesses:', err);
    return [];
  }
}

/**
 * Get a single process by ID
 */
export async function getProcessById(org_id: string, id: string): Promise<Process | null> {
  try {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .eq('org_id', org_id)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting process:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error in getProcessById:', err);
    return null;
  }
}

/**
 * List events for a process
 */
export async function listProcessEvents(org_id: string, process_id: string): Promise<ProcessEvent[]> {
  try {
    const { data, error } = await supabase
      .from('process_events')
      .select('*')
      .eq('org_id', org_id)
      .eq('process_id', process_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error listing process events:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (isTableNotFoundError(error)) {
        console.warn('⚠️ Tabela "process_events" não existe. Execute as migrações SQL primeiro.');
      }
      
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error in listProcessEvents:', err);
    return [];
  }
}

/**
 * Create a new process
 */
export async function createProcess(
  org_id: string,
  payload: CreateProcessPayload,
  created_by: string
): Promise<Process> {
  // Create the process
  const { data: process, error: processError } = await supabase
    .from('processes')
    .insert({
      org_id,
      titulo: payload.titulo,
      status: 'cadastro',
      cliente_nome: payload.cliente_nome || null,
      cliente_documento: payload.cliente_documento || null,
      cliente_contato: payload.cliente_contato || null,
      responsavel_user_id: payload.responsavel_user_id || null
    })
    .select()
    .single();

  if (processError || !process) {
    console.error('Error creating process:', processError);
    console.error('Error details:', JSON.stringify(processError, null, 2));
    throw processError;
  }

  // Create the initial event
  await supabase
    .from('process_events')
    .insert({
      org_id,
      process_id: process.id,
      tipo: 'registro',
      mensagem: `Processo "${payload.titulo}" criado com sucesso`,
      created_by
    });

  return process;
}

/**
 * Update process status
 */
export async function updateProcessStatus(
  org_id: string,
  process_id: string,
  status: Process['status'],
  created_by: string
): Promise<Process> {
  const statusLabels: Record<string, string> = {
    cadastro: 'Cadastro',
    triagem: 'Triagem',
    analise: 'Análise',
    concluido: 'Concluído'
  };

  // Update the process
  const { data: process, error: processError } = await supabase
    .from('processes')
    .update({ status })
    .eq('org_id', org_id)
    .eq('id', process_id)
    .select()
    .single();

  if (processError || !process) {
    console.error('Error updating process status:', processError);
    console.error('Error details:', JSON.stringify(processError, null, 2));
    throw processError;
  }

  // Create status change event
  await supabase
    .from('process_events')
    .insert({
      org_id,
      process_id,
      tipo: 'status_change',
      mensagem: `Status alterado para: ${statusLabels[status]}`,
      created_by
    });

  return process;
}

/**
 * Add an observation event to a process
 */
export async function addProcessEvent(
  org_id: string,
  process_id: string,
  tipo: ProcessEvent['tipo'],
  mensagem: string,
  created_by: string
): Promise<ProcessEvent> {
  const { data, error } = await supabase
    .from('process_events')
    .insert({
      org_id,
      process_id,
      tipo,
      mensagem,
      created_by
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error adding process event:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }

  return data;
}

/**
 * Update process fields
 */
export async function updateProcess(
  org_id: string,
  process_id: string,
  updates: Partial<Pick<Process, 'titulo' | 'cliente_nome' | 'cliente_documento' | 'cliente_contato' | 'responsavel_user_id'>>
): Promise<Process> {
  const { data, error } = await supabase
    .from('processes')
    .update(updates)
    .eq('org_id', org_id)
    .eq('id', process_id)
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating process:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }

  return data;
}

/**
 * Delete a process
 */
export async function deleteProcess(org_id: string, process_id: string): Promise<void> {
  const { error } = await supabase
    .from('processes')
    .delete()
    .eq('org_id', org_id)
    .eq('id', process_id);

  if (error) {
    console.error('Error deleting process:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}

/**
 * Get process statistics for dashboard
 */
export async function getProcessStats(org_id: string) {
  const defaultStats = { total: 0, cadastro: 0, triagem: 0, analise: 0, concluido: 0 };
  
  try {
    const { data, error } = await supabase
      .from('processes')
      .select('status')
      .eq('org_id', org_id);

    if (error) {
      console.error('Error getting process stats:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (isTableNotFoundError(error)) {
        console.warn('⚠️ Tabela "processes" não existe. Execute as migrações SQL primeiro.');
      }
      
      return defaultStats;
    }

    const stats = {
      total: data?.length || 0,
      cadastro: 0,
      triagem: 0,
      analise: 0,
      concluido: 0
    };

    data?.forEach((p) => {
      if (p.status in stats) {
        stats[p.status as keyof typeof stats]++;
      }
    });

    return stats;
  } catch (err) {
    console.error('Unexpected error in getProcessStats:', err);
    return defaultStats;
  }
}
