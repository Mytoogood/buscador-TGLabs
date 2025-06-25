// @ts-nocheck
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

// Instância do Supabase
let supabaseInstance = null;

// Configuração de armazenamento personalizado
const storage = {
  getItem: (key) => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }
};

// Função para obter a instância do Supabase
export function getSupabase() {
  // Se já temos uma instância, retornamos ela
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Verifica se está rodando no navegador
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Cria a instância do cliente Supabase
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: storage,
        storageKey: 'sb-auth-token',
        flowType: 'pkce',
        debug: process.env.NODE_ENV !== 'production'
      }
    });

    // Atualiza a instância global
    if (window) {
      window.supabase = supabaseInstance;
    }

    return supabaseInstance;
  } catch (error) {
    console.error('Erro ao criar o cliente Supabase:', error);
    return null;
  }
}

// Exporta a instância do Supabase
export const supabase = getSupabase();

// Plugin Vue 3
export default {
  install: (app) => {
    // Fornece a função getSupabase para ser usada nos componentes
    app.config.globalProperties.$getSupabase = getSupabase;
    app.provide('getSupabase', getSupabase);

    // Fornece a instância diretamente
    app.config.globalProperties.$supabase = supabase;
    app.provide('supabase', supabase);
  }
};
