/**
 * SGI FV - Migration Status Checker
 * Utility to verify if required database migrations have been run
 */

import { supabase } from '../../supabase';

export interface MigrationStatus {
  v_user_context: boolean;
  processes: boolean;
  process_events: boolean;
  organizations: boolean;
  org_members: boolean;
  allReady: boolean;
}

/**
 * Check if all required migrations have been run
 */
export async function checkMigrations(): Promise<MigrationStatus> {
  const status: MigrationStatus = {
    v_user_context: false,
    processes: false,
    process_events: false,
    organizations: false,
    org_members: false,
    allReady: false
  };
  
  try {
    // Check v_user_context view
    const { error: viewError } = await supabase
      .from('v_user_context')
      .select('user_id')
      .limit(1);
    status.v_user_context = !viewError;
    if (viewError) {
      console.log('v_user_context check:', viewError.message);
    }
    
    // Check processes table
    const { error: processesError } = await supabase
      .from('processes')
      .select('id')
      .limit(1);
    status.processes = !processesError;
    if (processesError) {
      console.log('processes check:', processesError.message);
    }
    
    // Check process_events table
    const { error: eventsError } = await supabase
      .from('process_events')
      .select('id')
      .limit(1);
    status.process_events = !eventsError;
    if (eventsError) {
      console.log('process_events check:', eventsError.message);
    }
    
    // Check organizations table
    const { error: orgsError } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);
    status.organizations = !orgsError;
    if (orgsError) {
      console.log('organizations check:', orgsError.message);
    }
    
    // Check org_members table
    const { error: membersError } = await supabase
      .from('org_members')
      .select('id')
      .limit(1);
    status.org_members = !membersError;
    if (membersError) {
      console.log('org_members check:', membersError.message);
    }
    
    // All ready if critical tables exist
    status.allReady = status.v_user_context && status.processes && status.organizations;
    
  } catch (err) {
    console.error('Error checking migrations:', err);
  }
  
  return status;
}

/**
 * Get a human-readable migration status message
 */
export function getMigrationStatusMessage(status: MigrationStatus): string | null {
  if (status.allReady) {
    return null;
  }
  
  const missing: string[] = [];
  
  if (!status.organizations) missing.push('organizations');
  if (!status.org_members) missing.push('org_members');
  if (!status.v_user_context) missing.push('v_user_context');
  if (!status.processes) missing.push('processes');
  if (!status.process_events) missing.push('process_events');
  
  if (missing.length === 0) {
    return null;
  }
  
  return `⚠️ Migrações não executadas! Tabelas/views ausentes: ${missing.join(', ')}. Execute os arquivos SQL em supabase/migrations/ no Supabase SQL Editor.`;
}
