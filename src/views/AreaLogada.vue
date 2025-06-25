<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              Painel de Controle - Moblix & Booking
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              Olá, <strong>{{ userProfile?.name || 'Usuário' }}</strong>
            </span>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      <p class="text-gray-600 mt-2">Bem-vindo de volta, {{ userProfile?.full_name || 'Usuário' }}!</p>
    </header>

    <!-- Conteúdo Principal -->
    <main>
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else>
        <!-- Seção de Aplicações -->
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Aplicações</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Card Moblix -->
            <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-center mb-4">
                <div class="p-3 bg-blue-100 rounded-lg mr-4">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium">Moblix</h3>
              </div>
              <p class="text-gray-600 mb-4">Acesse o dashboard do Moblix para gerenciar suas vendas e estoque.</p>
              <router-link 
                to="/moblix"
                class="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                Acessar Moblix
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>

            <!-- Card Booking.com -->
            <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-center mb-4">
                <div class="p-3 bg-green-100 rounded-lg mr-4">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium">Booking.com</h3>
              </div>
              <p class="text-gray-600 mb-4">Gerencie suas reservas e disponibilidade no Booking.com.</p>
              <router-link 
                to="/booking"
                class="text-green-600 hover:text-green-800 font-medium inline-flex items-center"
              >
                Acessar Booking.com
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>

            <!-- Card Relatórios -->
            <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-center mb-4">
                <div class="p-3 bg-purple-100 rounded-lg mr-4">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium">Relatórios</h3>
              </div>
              <p class="text-gray-600 mb-4">Acesse relatórios detalhados e análises dos seus dados.</p>
              <router-link 
                to="/relatorios"
                class="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center"
              >
                Ver Relatórios
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </section>

        <!-- Seção de Ferramentas Rápidas -->
        <section>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Ferramentas Rápidas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Nova Extração -->
            <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-center mb-4">
                <div class="p-3 bg-yellow-100 rounded-lg mr-4">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium">Nova Extração</h3>
              </div>
              <p class="text-gray-600 mb-4">Inicie uma nova extração de dados das plataformas integradas.</p>
              <button 
                @click="startNewExtraction"
                :disabled="isExtracting"
                class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
                :class="{
                  'opacity-50 cursor-not-allowed': isExtracting,
                  'hover:bg-yellow-500': isExtracting
                }"
              >
                <span v-if="isExtracting" class="inline-block mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span>{{ isExtracting ? 'Processando...' : 'Iniciar Extração' }}</span>
              </button>
            </div>

            <!-- Configurações -->
            <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-center mb-4">
                <div class="p-3 bg-gray-100 rounded-lg mr-4">
                  <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium">Configurações</h3>
              </div>
              <p class="text-gray-600 mb-4">Configure as preferências da sua conta e notificações.</p>
              <router-link 
                to="/configuracoes"
                class="text-gray-700 hover:text-gray-900 font-medium inline-flex items-center"
              >
                Acessar Configurações
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>

            <!-- Suporte -->
            <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-center mb-4">
                <div class="p-3 bg-red-100 rounded-lg mr-4">
                  <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 13a1 1 0 100-2 1 1 0 000 2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium">Suporte</h3>
              </div>
              <p class="text-gray-600 mb-4">Precisa de ajuda? Entre em contato com nossa equipe de suporte.</p>
              <button 
                @click="openSupport"
                class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                Falar com Suporte
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import { useToast } from 'vue-toast-notification'

export default {
  name: 'AreaLogada',
  
  setup() {
    const router = useRouter()
    const toast = useToast()
    const isLoading = ref(true)
    const error = ref(null)
    const isExtracting = ref(false)
    
    // Usar o authService para obter o perfil do usuário
    const userProfile = computed(() => authService.getUserProfile())
    const isAuthenticated = computed(() => authService.isAuthenticated.value)
    
    // Verificar autenticação ao montar o componente
    onMounted(async () => {
      try {
        // Verificar se o usuário está autenticado
        if (!isAuthenticated.value) {
          console.log('[AreaLogada] Usuário não autenticado, redirecionando...')
          router.push({ name: 'Login', query: { redirect: '/area-logada' } })
          return
        }
        
        console.log('[AreaLogada] Usuário autenticado:', userProfile.value)
      } catch (err) {
        console.error('[AreaLogada] Erro ao verificar autenticação:', err)
        error.value = 'Erro ao carregar dados do usuário.'
        toast.error('Erro ao carregar dados do usuário')
      } finally {
        isLoading.value = false
      }
    })
    
    // Função para fazer logout
    const handleLogout = async () => {
      try {
        await authService.logout()
        toast.success('Logout realizado com sucesso!')
        router.push('/')
      } catch (err) {
        console.error('[AreaLogada] Erro ao fazer logout:', err)
        error.value = 'Erro ao fazer logout. Tente novamente.'
        toast.error('Erro ao fazer logout')
      }
    }
    
    // Iniciar uma nova extração de dados
    const startNewExtraction = async () => {
      const toast = useToast()
      try {
        isExtracting.value = true
        // Simulando uma requisição de extração
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Em uma implementação real, você faria uma chamada para sua API aqui
        // const response = await api.startExtraction()
        
        toast.success('Extração de dados iniciada com sucesso!')
        console.log('Extração de dados iniciada')
      } catch (err) {
        console.error('Erro ao iniciar extração:', err)
        toast.error('Erro ao iniciar extração de dados')
      } finally {
        isExtracting.value = false
      }
    }
    
    // Abrir chat de suporte
    const openSupport = () => {
      const toast = useToast()
      toast.info('Abrindo chat de suporte...')
      // Aqui você pode implementar a lógica para abrir um chat de suporte
      console.log('Abrindo chat de suporte')
    }
    
    return {
      userProfile,
      handleLogout,
      startNewExtraction,
      openSupport,
      isLoading,
      isExtracting,
      error
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do componente */
</style>
