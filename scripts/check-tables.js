// Script para verificar as tabelas no Supabase
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    // Listar todas as tabelas do schema público
    const { data: tables, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (error) throw error;

    console.log('Tabelas encontradas no banco de dados:');
    console.table(tables);

    // Verificar se a tabela profiles existe
    const hasProfilesTable = tables.some(t => t.tablename === 'profiles');
    
    if (hasProfilesTable) {
      console.log('\nA tabela profiles existe. Verificando a estrutura...');
      
      // Verificar a estrutura da tabela profiles
      const { data: columns, error: columnError } = await supabase
        .rpc('get_columns_info', { table_name: 'profiles' });
      
      if (columnError) {
        console.log('Não foi possível obter informações das colunas:', columnError.message);
      } else {
        console.log('\nEstrutura da tabela profiles:');
        console.table(columns);
      }
    } else {
      console.log('\nA tabela profiles não existe. Ela precisa ser criada.');
    }
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
  }
}

checkTables();
