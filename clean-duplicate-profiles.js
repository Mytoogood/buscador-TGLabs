// Script para limpar registros duplicados na tabela profiles
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODk1MTYxNiwiZXhwIjoyMDM0NTI3NjE2fQ.4j6z4N4YwJQZJqJQJQJQJQJQJQJQJQJQJQJQJQJQJQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDuplicateProfiles() {
  try {
    console.log('🧹 Iniciando limpeza de registros duplicados na tabela profiles...');
    
    // Buscar todos os profiles
    const { data: allProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true }); // Ordenar por data de criação
    
    if (fetchError) {
      console.error('Erro ao buscar profiles:', fetchError);
      return;
    }
    
    console.log(`Total de profiles encontrados: ${allProfiles.length}`);
    
    // Agrupar por email
    const profilesByEmail = {};
    allProfiles.forEach(profile => {
      const email = profile.email.toLowerCase();
      if (!profilesByEmail[email]) {
        profilesByEmail[email] = [];
      }
      profilesByEmail[email].push(profile);
    });
    
    // Identificar emails duplicados
    const duplicateEmails = Object.keys(profilesByEmail).filter(
      email => profilesByEmail[email].length > 1
    );
    
    console.log(`Emails com duplicatas: ${duplicateEmails.length}`);
    
    if (duplicateEmails.length === 0) {
      console.log('✅ Nenhum registro duplicado encontrado!');
      return;
    }
    
    // Para cada email duplicado, manter apenas o mais antigo
    for (const email of duplicateEmails) {
      const profiles = profilesByEmail[email];
      console.log(`\n📧 Email: ${email} - ${profiles.length} registros`);
      
      // Ordenar por data de criação (mais antigo primeiro)
      profiles.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      
      // Manter o primeiro (mais antigo) e remover os outros
      const toKeep = profiles[0];
      const toDelete = profiles.slice(1);
      
      console.log(`   ✅ Mantendo: ID ${toKeep.id} (criado em ${toKeep.created_at})`);
      
      for (const profile of toDelete) {
        console.log(`   🗑️  Removendo: ID ${profile.id} (criado em ${profile.created_at})`);
        
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', profile.id);
        
        if (deleteError) {
          console.error(`   ❌ Erro ao remover profile ${profile.id}:`, deleteError);
        } else {
          console.log(`   ✅ Profile ${profile.id} removido com sucesso`);
        }
      }
    }
    
    // Verificar resultado final
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('email')
      .order('email');
    
    if (finalError) {
      console.error('Erro ao verificar resultado final:', finalError);
      return;
    }
    
    console.log('\n📊 Resultado final:');
    console.log(`Total de profiles após limpeza: ${finalProfiles.length}`);
    
    // Verificar se ainda há duplicatas
    const finalEmailCounts = {};
    finalProfiles.forEach(profile => {
      const email = profile.email.toLowerCase();
      finalEmailCounts[email] = (finalEmailCounts[email] || 0) + 1;
    });
    
    const remainingDuplicates = Object.keys(finalEmailCounts).filter(
      email => finalEmailCounts[email] > 1
    );
    
    if (remainingDuplicates.length === 0) {
      console.log('✅ Limpeza concluída com sucesso! Não há mais duplicatas.');
    } else {
      console.log(`⚠️  Ainda existem ${remainingDuplicates.length} emails com duplicatas:`, remainingDuplicates);
    }
    
  } catch (error) {
    console.error('Erro inesperado:', error);
  }
}

cleanDuplicateProfiles();
