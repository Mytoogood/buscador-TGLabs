// Script para remover 6 perfis específicos do banco de dados
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://rtxrgqlhdbsztsbnycln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eHJncWxoZGJzenRzYm55Y2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjU1MTAsImV4cCI6MjA2NjE0MTUxMH0.IcF22qbU7vMlwQ04RfY3Tc4z9vmQYs-2sYxKxQoTnpw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeSpecificProfiles() {
  try {
    const emailsToRemove = [
      'maximillion.kieren@msitip.com',
      'shaylyn.arrington@msitip.com',
      'felipecrs04@gmail.com',
      'ecoelho0100@gmail.com',
      'baraa.sariel@msitip.com',
      'meela.kirstan@msitip.com'
    ];

    console.log('🗑️ Removendo perfis específicos...');
    
    for (const email of emailsToRemove) {
      console.log(`Removendo: ${email}`);
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('email', email);

      if (deleteError) {
        console.error(`❌ Erro ao remover perfil ${email}:`, deleteError);
      } else {
        console.log(`✅ ${email} removido com sucesso!`);
      }
    }

    console.log('🎉 Remoção completa! Você pode cadastrar novos emails.');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

removeSpecificProfiles();
