// Script para verificar as configurações de autenticação
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para verificar as configurações de autenticação
async function checkAuthSettings() {
  try {
    console.log('Verificando configurações de autenticação...');
    
    // 1. Verificar configurações do site
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .single();

    if (siteError) {
      console.log('Não foi possível acessar as configurações do site:', siteError.message);
    } else {
      console.log('Configurações do site:', siteData);
    }

    // 2. Verificar configurações de autenticação
    const { data: authData, error: authError } = await supabase
      .from('auth.config')
      .select('*')
      .single();

    if (authError) {
      console.log('Não foi possível acessar as configurações de autenticação:', authError.message);
    } else {
      console.log('Configurações de autenticação:', authData);
    }

    // 3. Verificar provedores de autenticação habilitados
    const { data: providers, error: providersError } = await supabase.auth.getUser();
    
    if (providersError) {
      console.log('Erro ao verificar provedores de autenticação:', providersError.message);
    } else {
      console.log('Provedores de autenticação disponíveis:', providers);
    }

  } catch (error) {
    console.error('Erro ao verificar configurações:', error);
  }
}

// Executar a função
checkAuthSettings();
