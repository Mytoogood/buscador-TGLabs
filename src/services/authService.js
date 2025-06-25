import { ref, computed, readonly } from 'vue'
import { getSupabase } from '@/config/supabase'

// Global state
const currentUser = ref(null)
const isAuthenticated = computed(() => !!currentUser.value)
const isInitialized = ref(false)
const authStateListeners = new Set()

// Obtém o cliente Supabase
const getClient = () => {
  try {
    const client = getSupabase()
    if (!client) {
      throw new Error('Cliente Supabase não disponível')
    }
    return client
  } catch (error) {
    console.error('Erro ao obter cliente Supabase:', error)
    throw error
  }
}

// Set user profile data
const setUserProfile = (profileData) => {
  if (!currentUser.value) return null
  
  // Atualiza o perfil do usuário mantendo os dados existentes
  currentUser.value = {
    ...currentUser.value,
    ...profileData
  }
  
  // Notifica os listeners sobre a mudança de perfil
  notifyAuthStateChange('PROFILE_UPDATED')
  
  return currentUser.value
}

// Notificar listeners sobre mudanças de autenticação
const notifyAuthStateChange = (event) => {
  console.log(`[AuthService] Notificando ${authStateListeners.size} listeners sobre mudança de estado:`, event)
  authStateListeners.forEach(callback => {
    try {
      callback(event)
    } catch (error) {
      console.error('Erro ao notificar listener de autenticação:', error)
    }
  })
}

// Registrar listener para mudanças de autenticação
const onAuthStateChange = (callback) => {
  if (typeof callback !== 'function') {
    console.warn('[AuthService] onAuthStateChange espera uma função como argumento')
    return () => {}
  }
  
  // Adiciona o callback ao conjunto de listeners
  authStateListeners.add(callback)
  
  console.log(`[AuthService] Listener adicionado. Total de listeners: ${authStateListeners.size}`)
  
  // Retorna uma função para remover o listener
  return () => {
    removeAuthStateChangeListener(callback)
  }
}

// Remover um listener de mudanças de autenticação
const removeAuthStateChangeListener = (callback) => {
  if (typeof callback !== 'function') {
    console.warn('[AuthService] removeAuthStateChangeListener espera uma função como argumento')
    return
  }
  
  const wasRemoved = authStateListeners.delete(callback)
  if (wasRemoved) {
    console.log(`[AuthService] Listener removido. Total de listeners: ${authStateListeners.size}`)
  } else {
    console.warn('[AuthService] Tentativa de remover um listener que não existe')
  }
}

// Configurar listener de autenticação do Supabase
let authListener = null

// Limpar todos os listeners ao destruir o serviço
const cleanup = () => {
  console.log('[AuthService] Limpando recursos do serviço de autenticação')
  
  // Remove o listener de autenticação
  if (authListener?.unsubscribe) {
    console.log('[AuthService] Removendo listener de autenticação')
    authListener.unsubscribe()
    authListener = null
  }
  
  // Limpa o estado
  currentUser.value = null
  isInitialized.value = false
  
  console.log('[AuthService] Recursos limpos com sucesso')
}

const setupAuthListener = () => {
  // Se já houver um listener ativo, não criar outro
  if (authListener) {
    console.log('[AuthService] Listener de autenticação já configurado')
    return () => {}
  }
  
  const supabase = getClient()
  if (!supabase) {
    console.error('[AuthService] Cliente Supabase não disponível para configurar listener')
    return () => {}
  }
  
  console.log('[AuthService] Configurando listener de autenticação...')
  
  // Configura o listener de autenticação do Supabase
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`[AuthService] Evento de autenticação recebido: ${event}`)
    
    try {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          console.log(`[AuthService] Usuário autenticado: ${session.user.email}`)
          
          // Atualiza o estado do usuário com os dados básicos
          const userData = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata || {},
            app_metadata: session.user.app_metadata || {},
            role: session.user.role,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at
          }
          
          currentUser.value = userData
          
          // Carrega o perfil do usuário em segundo plano
          loadUserProfile(session.user.id)
            .then(profile => {
              if (profile) {
                console.log('[AuthService] Perfil carregado via listener:', profile)
                currentUser.value = {
                  ...currentUser.value,
                  ...profile
                }
              }
            })
            .catch(profileError => {
              console.warn('[AuthService] Aviso ao carregar perfil via listener:', profileError)
            })
        }
      } 
      else if (event === 'SIGNED_OUT') {
        console.log('[AuthService] Usuário deslogado')
        currentUser.value = null
      }
      
      // Notifica os listeners sobre a mudança de estado
      notifyAuthStateChange(event)
      
    } catch (error) {
      console.error('[AuthService] Erro no listener de autenticação:', error)
    }
  })
  
  // Armazena a referência do listener
  authListener = subscription
  
  // Retorna a função para cancelar a inscrição
  return () => {
    if (authListener?.unsubscribe) {
      console.log('[AuthService] Removendo listener de autenticação')
      authListener.unsubscribe()
      authListener = null
    }
  }
}

// Initialize auth state from stored session
const initAuth = async () => {
  // Evitar múltiplas inicializações simultâneas
  if (isInitialized.value) {
    console.log('[AuthService] Autenticação já inicializada')
    return !!currentUser.value
  }

  console.log('[AuthService] Inicializando verificação de autenticação...')
  
  // Marcar como inicializado para evitar loops
  isInitialized.value = true
  
  try {
    // Obtém o cliente Supabase
    const supabase = getClient()
    if (!supabase) {
      console.error('[AuthService] Cliente Supabase não disponível')
      throw new Error('Cliente Supabase não disponível')
    }

    // Configura o listener de autenticação
    setupAuthListener()
    
    // Limpar estado atual
    currentUser.value = null
    
    // Obter sessão do Supabase
    console.log('[AuthService] Buscando sessão do Supabase...')
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('[AuthService] Erro ao buscar sessão:', error)
      throw error
    }
    
    console.log('[AuthService] Resposta da sessão:', { 
      hasSession: !!session, 
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
    })
    
    if (session?.user) {
      console.log('[AuthService] Sessão encontrada para o usuário:', session.user.email)
      
      // Primeiro define o usuário básico para feedback imediato na UI
      const userData = { 
        id: session.user.id,
        email: session.user.email,
        user_metadata: session.user.user_metadata || {},
        app_metadata: session.user.app_metadata || {},
        role: session.user.role,
        created_at: session.user.created_at,
        updated_at: session.user.updated_at
      }
      
      currentUser.value = userData
      
      // Carregar perfil do usuário em segundo plano
      loadUserProfile(session.user.id)
        .then(profile => {
          if (profile) {
            currentUser.value = {
              ...currentUser.value,
              ...profile
            }
          }
        })
        .catch(profileError => {
          console.warn('[AuthService] Aviso ao carregar perfil:', profileError)
        })
      
      // Notifica os listeners sobre a autenticação bem-sucedida
      notifyAuthStateChange('SIGNED_IN')
      
      return true
    }
    
    console.log('[AuthService] Nenhuma sessão ativa encontrada')
    return false
    
  } catch (error) {
    console.error('[AuthService] Erro ao inicializar autenticação:', error)
    currentUser.value = null
    isInitialized.value = false // Reset para permitir nova tentativa
    return false
  }
}

// Função para carregar o perfil do usuário
const loadUserProfile = async (userId) => {
  if (!userId) {
    console.warn('[AuthService] ID de usuário não fornecido para carregar perfil')
    return null
  }
  
  const supabase = getClient()
  if (!supabase) {
    console.error('[AuthService] Cliente Supabase não disponível para carregar perfil')
    return null
  }
  
  try {
    console.log(`[AuthService] Carregando perfil do usuário ${userId}...`)
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      // Se não encontrar o perfil, não é um erro crítico
      if (error.code === 'PGRST116') { // Código para 'No rows found'
        console.log(`[AuthService] Perfil não encontrado para o usuário ${userId}`)
        return null
      }
      throw error
    }
    
    if (!profile) {
      console.log(`[AuthService] Nenhum perfil encontrado para o usuário ${userId}`)
      return null
    }
    
    console.log('[AuthService] Perfil carregado com sucesso:', profile)
    
    // Atualiza o usuário com os dados do perfil (se o usuário ainda estiver logado)
    if (currentUser.value && currentUser.value.id === userId) {
      const updatedUser = {
        ...currentUser.value,
        ...profile,
        // Garante que os metadados não sobrescrevam os campos principais
        email: currentUser.value.email,
        id: currentUser.value.id
      }
      
      currentUser.value = updatedUser
      
      // Notifica os listeners sobre a atualização do perfil
      notifyAuthStateChange('USER_UPDATED')
    }
    
    return profile
    
  } catch (error) {
    console.error('[AuthService] Erro ao carregar perfil do usuário:', error)
    // Não lança o erro para não quebrar o fluxo de login
    return null
  }
}

// Login function
const login = async function(email, password, rememberMe = false) {
  const supabase = getClient()
  
  try {
    console.log('[AuthService] Iniciando login para:', email)
    
    // Limpar estado atual
    currentUser.value = null
    
    // Fazer login com email e senha
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    })
    
    if (error) {
      console.error('[AuthService] Erro no login:', error)
      return { 
        success: false, 
        error: error,
        user: null,
        session: null
      }
    }
    
    if (!data?.user) {
      console.error('[AuthService] Nenhum dado de usuário retornado')
      return { 
        success: false, 
        error: { message: 'No user data returned from login' },
        user: null,
        session: null
      }
    }
    
    console.log('[AuthService] Login bem-sucedido para:', data.user.email)
    
    // Atualizar estado do usuário com os dados básicos
    const userData = { 
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata || {},
      app_metadata: data.user.app_metadata || {},
      role: data.user.role,
      created_at: data.user.created_at,
      updated_at: data.user.updated_at
    }
    
    currentUser.value = userData
    
    // Forçar atualização da sessão
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('[AuthService] Erro ao obter sessão após login:', sessionError)
      return { 
        success: false, 
        error: sessionError,
        user: userData,
        session: null
      }
    }
    
    console.log('[AuthService] Sessão após login:', sessionData?.session ? 'válida' : 'inválida')
    
    // Carregar perfil do usuário em segundo plano
    loadUserProfile(data.user.id)
      .then(profile => {
        if (profile) {
          currentUser.value = {
            ...currentUser.value,
            ...profile
          }
        }
      })
      .catch(profileError => {
        console.warn('[AuthService] Aviso ao carregar perfil:', profileError)
      })
    
    // Notificar listeners sobre a mudança de estado
    notifyAuthStateChange('SIGNED_IN')
    
    return { 
      success: true, 
      user: { ...userData },
      session: sessionData?.session,
      error: null 
    }
    
  } catch (error) {
    console.error('[AuthService] Erro inesperado no login:', error)
    return { 
      success: false, 
      error: {
        message: error.message || 'Erro inesperado ao fazer login',
        status: error.status
      },
      user: null,
      session: null
    }
  }
}

// Register function
const register = async function(userData) {
  const supabase = getClient()
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
        },
      },
    })

    if (authError) throw authError

    if (authData?.user) {
      // Create profile in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (profileError) throw profileError

      return { 
        success: true, 
        user: {
          ...authData.user,
          ...profileData
        } 
      }
    }

    return { success: false, error: 'Erro ao criar conta' }
  } catch (error) {
    console.error('Registration error:', error)
    return { 
      success: false, 
      error: error.message || 'Erro ao criar conta. Tente novamente.' 
    }
  }
}

// Logout function
const logout = async function() {
  const supabase = getClient()
  try {
    console.log('Logging out user...')
    
    // Clear global state first to prevent race conditions
    const userId = currentUser.value?.id
    currentUser.value = null
    
    // Clear all session data
    localStorage.removeItem('supabase.auth.token')
    sessionStorage.removeItem('supabase.auth.token')
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error during sign out:', error)
      // Even if sign out fails, we still want to clear local state
      return { 
        success: false, 
        error: 'Sessão encerrada, mas houve um erro ao limpar os dados locais.' 
      }
    }
    
    console.log('User logged out successfully')
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    // Even if there's an error, we still want to clear local state
    currentUser.value = null
    localStorage.removeItem('supabase.auth.token')
    sessionStorage.removeItem('supabase.auth.token')
    
    return { 
      success: false, 
      error: error.message || 'Erro ao fazer logout. Por favor, tente novamente.' 
    }
  }
}

// Check if user has specific permissions (for future use)
const hasPermission = (permission) => {
  if (!currentUser.value) return false
  
  // For now, all authenticated users have basic permissions
  // In the future, you could check user roles here
  return true
}

// Get user profile data
const getUserProfile = () => {
  // Return a copy of the current user data
  return currentUser.value ? { ...currentUser.value } : null
}

// Refresh user profile data from the server
const refreshUserProfile = async () => {
  if (!currentUser.value?.id) {
    console.warn('Cannot refresh profile: No current user ID')
    return null
  }
  
  try {
    console.log('Refreshing profile for user ID:', currentUser.value.id)
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.value.id)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
    
    if (!profile) {
      console.warn('No profile found for user ID:', currentUser.value.id)
      return null
    }
    
    console.log('Profile refreshed successfully:', profile)
    
    // Mantém os dados existentes e mescla com os novos dados do perfil
    currentUser.value = {
      ...currentUser.value,
      ...profile
    }
    
    return { ...currentUser.value }
  } catch (error) {
    console.error('Error refreshing user profile:', error)
    
    // Se a sessão estiver inválida, faz logout
    if (error?.message?.includes('Invalid JWT') || error?.status === 401) {
      console.warn('Session expired, logging out...')
      await logout()
    }
    
    return null
  }
}

// Update user profile
const updateUserProfile = async (updatedData) => {
  if (!currentUser.value) return { success: false, error: 'Usuário não autenticado' }
  
  try {
    // Update auth user data (email, password)
    const updates = {}
    if (updatedData.email) updates.email = updatedData.email
    
    if (Object.keys(updates).length > 0) {
      const { error: authError } = await supabase.auth.updateUser(updates)
      if (authError) throw authError
    }
    
    // Update profile data in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: updatedData.name || currentUser.value.name,
        phone: updatedData.phone || currentUser.value.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentUser.value.id)
    
    if (profileError) throw profileError
    
    // Update current user data
    currentUser.value = {
      ...currentUser.value,
      name: updatedData.name || currentUser.value.name,
      email: updatedData.email || currentUser.value.email,
      phone: updatedData.phone || currentUser.value.phone
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { 
      success: false, 
      error: error.message || 'Erro ao atualizar perfil' 
    }
  }
}

// Change password
const changePassword = async function(currentPassword, newPassword) {
  const supabase = getClient()
  try {
    // First, sign in to verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentUser.value.email,
      password: currentPassword
    })
    
    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        throw new Error('Senha atual incorreta')
      }
      throw signInError
    }
    
    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (updateError) throw updateError
    
    return { success: true }
  } catch (error) {
    console.error('Error changing password:', error)
    return { 
      success: false, 
      error: error.message || 'Erro ao alterar senha' 
    }
  }
}

// Get session info
const getSessionInfo = async function() {
  const supabase = getClient()
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    if (session) {
      return {
        isAuthenticated: true,
        loginTime: session.created_at,
        expiresAt: session.expires_at,
        user: session.user
      }
    }
    
    return {
      isAuthenticated: false,
      loginTime: null,
      user: null
    }
  } catch (error) {
    console.error('Erro ao obter informações da sessão:', error)
    return {
      isAuthenticated: false,
      loginTime: null,
      user: null
    }
  }
}

// Helper para obter a sessão atual
const getCurrentSession = async function() {
  const supabase = getClient()
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Erro ao obter sessão atual:', error)
    return null
  }
}

// Inicializa o serviço de autenticação
const init = async () => {
  // Se já estiver inicializado, retorna imediatamente
  if (isInitialized.value) {
    console.log('[AuthService] Serviço já inicializado')
    return true
  }
  
  console.log('[AuthService] Inicializando serviço de autenticação...')
  
  try {
    // Limpa qualquer estado anterior
    cleanup()
    
    // Inicializa a autenticação
    const isAuthenticated = await initAuth()
    
    console.log('[AuthService] Serviço de autenticação inicializado com sucesso')
    console.log(`[AuthService] Estado de autenticação: ${isAuthenticated ? 'Autenticado' : 'Não autenticado'}`)
    
    return isAuthenticated
    
  } catch (error) {
    console.error('[AuthService] Erro ao inicializar serviço de autenticação:', error)
    
    // Tenta limpar o estado em caso de erro
    try {
      cleanup()
    } catch (cleanupError) {
      console.error('[AuthService] Erro ao limpar recursos após falha na inicialização:', cleanupError)
    }
    
    return false
  }
}

// Função para verificar se o usuário está autenticado
const checkAuth = async () => {
  if (!isInitialized.value) {
    console.log('[AuthService] Serviço não inicializado, verificando autenticação...')
    return await init()
  }
  
  const supabase = getClient()
  if (!supabase) return false
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session?.user
  } catch (error) {
    console.error('[AuthService] Erro ao verificar autenticação:', error)
    return false
  }
}

// Exporta as funções e propriedades públicas
export default {
  // Propriedades reativas
  currentUser: readonly(currentUser),
  isAuthenticated: computed(() => !!currentUser.value),
  isInitialized: readonly(isInitialized),
  
  // Métodos principais
  init,
  checkAuth,
  login,
  logout,
  register,
  changePassword,
  
  // Gerenciamento de perfil
  loadUserProfile,
  updateUserProfile: async (data) => {
    const result = await updateUserProfile(data)
    if (result) {
      notifyAuthStateChange('PROFILE_UPDATED')
    }
    return result
  },
  
  // Sessão e autenticação
  getSessionInfo,
  getCurrentSession: async () => {
    const supabase = getClient()
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    return data?.session || null
  },
  
  // Gerenciamento de estado
  onAuthStateChange,
  removeAuthStateChangeListener,

  // Utilitários
  hasPermission,
  getUserProfile: () => currentUser.value ? { ...currentUser.value } : null,

  // Inicialização interna
  initAuth,
  
  // Atualização de perfil
  refreshUserProfile
}

// Exporta um objeto com todas as funções e propriedades para uso com useAuth()
export const useAuth = () => ({
  // Métodos principais
  init,
  login,
  register,
  logout,
  hasPermission,
  loadUserProfile,
  updateUserProfile,
  changePassword,
  getSessionInfo,
  onAuthStateChange,
  removeAuthStateChangeListener,
  cleanup,

  // Aliases para compatibilidade
  getCurrentSession: getSessionInfo,
  checkAuth,

  // Função para obter o perfil do usuário
  getUserProfile: () => currentUser.value ? { ...currentUser.value } : null,

  // Propriedades reativas
  currentUser: readonly(currentUser),
  isAuthenticated: computed(() => !!currentUser.value),
  isInitialized: readonly(isInitialized)
})

// Exporta o objeto authState como padrão para compatibilidade com versões anteriores
export const authState = {
  // Getters para propriedades reativas
  get currentUser() { return readonly(currentUser) },
  get isAuthenticated() { return computed(() => !!currentUser.value) },
  get isInitialized() { return readonly(isInitialized) },
  
  // Métodos principais
  init,
  login,
  register,
  logout,
  hasPermission,
  loadUserProfile,
  updateUserProfile,
  changePassword,
  getSessionInfo,
  onAuthStateChange,
  removeAuthStateChangeListener,
  cleanup,
  
  // Aliases para compatibilidade
  getCurrentSession: getSessionInfo,
  checkAuth,
  
  // Função para obter o perfil do usuário
  getUserProfile: () => currentUser.value ? { ...currentUser.value } : null
}
