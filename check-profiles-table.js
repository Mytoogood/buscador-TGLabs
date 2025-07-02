// Script para verificar a tabela profiles
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfilesTable() {
  try {
    console.log('Verificando a tabela profiles...');
    
    // Tentar fazer uma consulta simples na tabela profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ A tabela profiles não existe.');
        console.log('Precisamos criar a tabela profiles.');
        return false;
      } else {
        console.error('Erro ao acessar a tabela profiles:', error);
        return false;
      }
    }

    console.log('✅ A tabela profiles existe!');
    if (data && data.length > 0) {
      console.log('Estrutura da tabela (baseada no primeiro registro):');
      console.log(Object.keys(data[0]));
    } else {
      console.log('A tabela existe mas está vazia.');
    }
    
    return true;
  } catch (error) {
    console.error('Erro inesperado:', error);
    return false;
  }
}

checkProfilesTable();
