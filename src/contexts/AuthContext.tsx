/**
 * SGI FV - Auth Context
 * Provides authentication state and user context throughout the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabase';
import type { UserContext, OrgRole } from '../../types';

interface AuthContextValue {
  session: Session | null;
  userContext: UserContext | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  refreshContext: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
 * Fetch user context from v_user_context view
 */
async function fetchUserContext(userId: string): Promise<{ context: UserContext | null; error: string | null }> {
  try {
    // Use maybeSingle() to handle case where no rows exist
    const { data, error } = await supabase
      .from('v_user_context')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user context:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check if it's a "relation does not exist" error
      if (isTableNotFoundError(error)) {
        return { 
          context: null, 
          error: '⚠️ Banco de dados não configurado. Execute as migrações SQL primeiro.\n\nVeja PROCESSES_MODULE.md para instruções detalhadas.' 
        };
      }
      
      return { 
        context: null, 
        error: 'Erro ao carregar contexto do usuário. Por favor, tente novamente.' 
      };
    }

    if (!data) {
      console.warn('No user context found for user:', userId);
      return { 
        context: null, 
        error: 'Usuário não vinculado a nenhuma organização. Entre em contato com o administrador.' 
      };
    }

    return {
      context: {
        id: data.user_id,
        email: data.email || '',
        nome_completo: data.nome_completo || '',
        org_id: data.org_id || '',
        org_slug: data.org_slug || 'default',
        org_name: data.org_name || 'Sem organização',
        role: (data.org_role || 'client') as OrgRole,
        profile: null
      },
      error: null
    };
  } catch (err) {
    console.error('Unexpected error fetching user context:', err);
    return { 
      context: null, 
      error: 'Erro inesperado ao carregar dados. Por favor, tente novamente.' 
    };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContext = useCallback(async (userId: string) => {
    const result = await fetchUserContext(userId);
    setUserContext(result.context);
    setError(result.error);
    return result;
  }, []);

  const refreshContext = useCallback(async () => {
    if (session?.user?.id) {
      setLoading(true);
      setError(null);
      try {
        await loadContext(session.user.id);
      } finally {
        setLoading(false);
      }
    }
  }, [session, loadContext]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserContext(null);
    setError(null);
  }, []);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        
        if (initialSession?.user?.id) {
          await loadContext(initialSession.user.id);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Erro ao inicializar autenticação. Por favor, recarregue a página.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event);
        setSession(newSession);
        
        if (event === 'SIGNED_IN' && newSession?.user?.id) {
          setLoading(true);
          setError(null);
          try {
            await loadContext(newSession.user.id);
          } finally {
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setUserContext(null);
          setError(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadContext]);

  const isAdmin = userContext?.role === 'admin' || userContext?.role === 'owner';

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show error state only if user is authenticated but context failed
  if (error && session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-4">Erro ao Carregar</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={refreshContext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Sair e Fazer Login Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      session,
      userContext,
      loading,
      error,
      isAdmin,
      refreshContext,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
