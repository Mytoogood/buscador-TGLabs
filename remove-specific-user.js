import { createClient } from '@supabase/supabase-js'

// Configuração para Supabase local
const supabaseUrl = 'https://rvdxbrruhxkldhvpvpek.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZHhicnJ1aHhrbGRodnB2cGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNzM0NjQsImV4cCI6MjA0Nzk0OTQ2NH0.NKJBFmDYyE_j1A7nE7--H8jkC_A2r1V_TkEgwNBKQaM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function removeSpecificUser() {
  try {
    console.log('🗑️ Removendo usuário específico...')
    
    const emailToRemove = 'baraa.sariel@msitip.com'
    
    // 1. Primeiro buscar o perfil para obter o ID
    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('email', emailToRemove)
    
    if (searchError) {
      console.error('❌ Erro ao buscar perfil:', searchError)
      return
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('ℹ️ Nenhum perfil encontrado com este email')
      return
    }
    
    const profile = profiles[0]
    console.log(`📋 Perfil encontrado: ${profile.name} (${profile.email}) - ID: ${profile.id}`)
    
    // 2. Remover o perfil
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profile.id)
    
    if (deleteError) {
      console.error('❌ Erro ao remover perfil:', deleteError)
      return
    }
    
    console.log('✅ Perfil removido com sucesso!')
    
    // 3. Verificar se foi removido
    const { data: verification, error: verifyError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', emailToRemove)
    
    if (verifyError) {
      console.error('❌ Erro ao verificar remoção:', verifyError)
      return
    }
    
    if (!verification || verification.length === 0) {
      console.log('✅ Confirmado: Email removido da base de dados')
      console.log('🎉 Agora você pode cadastrar novamente com este email!')
    } else {
      console.log('⚠️ Aviso: Email ainda existe na base de dados')
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
  }
}

removeSpecificUser()
