<template>
<div class="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
    <!-- Header Elegante -->
<header class="bg-primary-900/80 backdrop-blur-md shadow-md">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">
                ✈️ Portal de Voos - Júlio Martins
              </h1>
              <p class="text-sm text-accent-light">Busca e reserva de passagens aéreas</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right mr-4">
              <p class="text-sm font-medium text-white">Olá, {{ userProfile?.name || 'Usuário' }}!</p>
              <p class="text-xs text-accent-light">Portal de Voos</p>
            </div>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl shadow-md text-red-700 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-105"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal -->
<main class="transition-all duration-300">
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else>
        <!-- Hero Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
              ✈️ Bem-vindo ao <span class="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent font-extrabold">Portal de Voos</span>
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Encontre e reserve as melhores passagens aéreas com preços exclusivos
            </p>
          </div>
          
          <!-- Cards Principais -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <!-- Buscar Voos -->
            <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <div class="flex items-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mr-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900">Buscar Voos</h3>
              </div>
              <p class="text-gray-600 mb-6 text-lg">Encontre as melhores opções de voos com preços competitivos e horários flexíveis.</p>
              <router-link 
                to="/flights"
                class="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                Buscar Voos Agora
              </router-link>
            </div>

            <!-- Ofertas Especiais -->
            <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <div class="flex items-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900">Ofertas Especiais</h3>
              </div>
              <p class="text-gray-600 mb-6 text-lg">Confira nossas ofertas exclusivas e promoções imperdíveis para destinos nacionais e internacionais.</p>
              <router-link 
                to="/ofertas"
                class="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                Ver Ofertas
              </router-link>
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
