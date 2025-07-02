<template>
  <div class="dashboard min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              Painel Júlio Martins - {{ userProfile?.name || 'Agência' }}
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative" @click="showProfileDropdown = !showProfileDropdown">
              <button class="flex items-center space-x-2 focus:outline-none">
                <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {{ userInitials }}
                </div>
                <span class="text-sm font-medium text-gray-700">{{ userProfile?.name || 'Usuário' }}</span>
                <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown do perfil -->
              <div v-if="showProfileDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50" v-click-outside="() => showProfileDropdown = false">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configurações</a>
                <div class="border-t border-gray-100 my-1"></div>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" @click="handleLogout">Sair</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white mb-8 shadow-lg">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 class="text-3xl font-bold mb-2 flex items-center">
              <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Painel de Controle Júlio Martins
            </h2>
            <p class="text-blue-100 text-lg">
              Gerencie suas milhas, cotações e clientes em um só lugar
            </p>
          </div>
          <div class="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button 
              @click="$router.push('/dashboard/transactions/new')"
              class="flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Nova Transação
            </button>
            <button 
              @click="$router.push('/dashboard/clients/new')"
              class="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Adicionar Cliente
            </button>
            <button 
              @click="$router.push('/flights')"
              class="flex items-center px-4 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors border border-green-100"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Buscar Voos
            </button>
            <button 
              @click="$router.push('/ofertas')"
              class="flex items-center px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-medium hover:bg-yellow-100 transition-colors border border-yellow-100"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              Ofertas Especiais
            </button>
          </div>
        </div>
      </div>

      <!-- Cards de Resumo -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Saldo Total -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Saldo Total</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900">
                {{ formatNumber(dashboardData.totalMiles) }} <span class="text-base text-gray-500">milhas</span>
              </p>
              <p class="mt-1 text-sm font-medium flex items-center" :class="getTrendClass(dashboardData.milesTrend)">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTrendIcon(dashboardData.milesTrend)"></path>
                </svg>
                {{ Math.abs(dashboardData.milesTrend) }}% em 30 dias
              </p>
            </div>
            <div class="p-3 rounded-lg bg-blue-50">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Clientes Ativos -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Clientes Ativos</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900">
                {{ formatNumber(dashboardData.activeClients) }}
              </p>
              <p class="mt-1 text-sm font-medium flex items-center" :class="getTrendClass(dashboardData.clientsTrend)">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTrendIcon(dashboardData.clientsTrend)"></path>
                </svg>
                {{ Math.abs(dashboardData.clientsTrend) }}% em 30 dias
              </p>
            </div>
            <div class="p-3 rounded-lg bg-green-50">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Transações (30 dias) -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Transações (30d)</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900">
                {{ formatNumber(dashboardData.monthlyTransactions) }}
              </p>
              <p class="mt-1 text-sm font-medium flex items-center" :class="getTrendClass(dashboardData.transactionsTrend)">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTrendIcon(dashboardData.transactionsTrend)"></path>
                </svg>
                {{ Math.abs(dashboardData.transactionsTrend) }}% em 30 dias
              </p>
            </div>
            <div class="p-3 rounded-lg bg-purple-50">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Valor Médio por Transação -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Ticket Médio</p>
              <p class="mt-1 text-2xl font-semibold text-gray-900">
                {{ formatCurrency(dashboardData.averageTicket) }}
              </p>
              <p class="mt-1 text-sm font-medium flex items-center" :class="getTrendClass(dashboardData.ticketTrend)">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTrendIcon(dashboardData.ticketTrend)"></path>
                </svg>
                {{ Math.abs(dashboardData.ticketTrend) }}% em 30 dias
              </p>
            </div>
            <div class="p-3 rounded-lg bg-yellow-50">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção Principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Gráfico de Atividades Recentes -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
            <div class="flex space-x-2">
              <button 
                v-for="period in ['Dia', 'Semana', 'Mês']" 
                :key="period"
                @click="selectedPeriod = period"
                class="px-3 py-1 text-sm rounded-full"
                :class="selectedPeriod === period ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'"
              >
                {{ period }}
              </button>
            </div>
          </div>
          <div class="h-64">
            <!-- Gráfico de linhas será implementado aqui -->
            <div class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <p class="text-gray-500">Gráfico de atividades recentes</p>
            </div>
          </div>
        </div>

        <!-- Últimas Transações -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Últimas Transações</h3>
            <button 
              @click="$router.push('/dashboard/transactions')" 
              class="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todas
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="transaction in recentTransactions" :key="transaction.id" class="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" :class="getTransactionTypeClass(transaction.type).bg">
                <component :is="getTransactionTypeClass(transaction.type).icon" class="h-5 w-5 text-white" />
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ transaction.description }}</p>
                <p class="text-xs text-gray-500">{{ transaction.date }} • {{ transaction.time }}</p>
              </div>
              <div class="ml-4 text-right">
                <p class="text-sm font-medium" :class="transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ transaction.amount >= 0 ? '+' : '' }}{{ formatCurrency(transaction.amount) }}
                </p>
                <p class="text-xs text-gray-500">{{ transaction.miles.toLocaleString() }} milhas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <a
          href="https://www.instagram.com/juliomartins__/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
        >
          <span class="text-lg mr-2">📸</span>
          Instagram
        </a>
        <a
          href="https://juliomartins.my.canva.site/simple-dark-fashion-bio-link-website-black-and-white-in-modern-style"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
        >
          <span class="text-lg mr-2">✈️</span>
          Consultoria
        </a>
        <router-link
          to="/search"
          class="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
        >
          <span class="text-lg mr-2">🏨</span>
          Buscar Hotéis
        </router-link>
        <router-link
          to="/bookings"
          class="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-200"
        >
          <span class="text-lg mr-2">📋</span>
          Minhas Reservas
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">👥</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Membros da Comunidade</p>
              <p class="text-2xl font-bold text-gray-900">10.000+</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">✈️</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Países Visitados</p>
              <p class="text-2xl font-bold text-gray-900">70+</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">💎</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Milhas Acumuladas</p>
              <p class="text-2xl font-bold text-gray-900">100M+</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest Updates -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">
          📢 Últimas Atualizações
        </h3>
        <div class="space-y-4">
          <div class="border-l-4 border-blue-500 pl-4">
            <h4 class="font-medium text-gray-900">Nova promoção de milhas disponível!</h4>
            <p class="text-sm text-gray-600 mt-1">
              Aproveite as ofertas especiais de transferência de milhas com bônus de até 100%.
            </p>
            <p class="text-xs text-gray-500 mt-2">2 horas atrás</p>
          </div>
          
          <div class="border-l-4 border-green-500 pl-4">
            <h4 class="font-medium text-gray-900">Webinar gratuito sobre estratégias de acúmulo</h4>
            <p class="text-sm text-gray-600 mt-1">
              Participe do próximo webinar e aprenda novas técnicas para acelerar o acúmulo de milhas.
            </p>
            <p class="text-xs text-gray-500 mt-2">1 dia atrás</p>
          </div>

          <div class="border-l-4 border-yellow-500 pl-4">
            <h4 class="font-medium text-gray-900">Novo grupo exclusivo no Telegram</h4>
            <p class="text-sm text-gray-600 mt-1">
              Acesso liberado para o grupo VIP com alertas em tempo real das melhores oportunidades.
            </p>
            <p class="text-xs text-gray-500 mt-2">3 dias atrás</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import moblixService from '@/services/moblixService'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const sessionInfo = ref(null)
    const isLoading = ref(true)
    const error = ref(null)
    const selectedPeriod = ref('Mês')
    const dashboardData = ref({
      totalMiles: 0,
      activeClients: 0,
      monthlyTransactions: 0,
      averageTicket: 0,
      milesTrend: 0,
      clientsTrend: 0,
      transactionsTrend: 0,
      ticketTrend: 0
    })
    
    const userProfile = computed(() => authService.getUserProfile())
    const userInitials = computed(() => {
      const name = userProfile.value?.name || 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    })
    const isAuthenticated = computed(() => authService.isAuthenticated.value)
    const showProfileDropdown = ref(false)

    // Dados de exemplo para transações recentes
    const recentTransactions = ref([
      {
        id: 1,
        type: 'purchase',
        description: 'Compra de milhas LATAM',
        amount: 2850.00,
        miles: 25000,
        date: '15/06/2023',
        time: '14:30',
        status: 'completed'
      },
      {
        id: 2,
        type: 'transfer',
        description: 'Transferência para Cliente',
        amount: -1500.00,
        miles: -15000,
        date: '14/06/2023',
        time: '09:15',
        status: 'completed'
      },
      {
        id: 3,
        type: 'deposit',
        description: 'Depósito de milhas',
        amount: 0.00,
        miles: 40000,
        date: '13/06/2023',
        time: '16:45',
        status: 'completed'
      },
      {
        id: 4,
        type: 'withdrawal',
        description: 'Resgate de milhas',
        amount: 0.00,
        miles: -10000,
        date: '10/06/2023',
        time: '11:20',
        status: 'processing'
      },
      {
        id: 5,
        type: 'purchase',
        description: 'Compra de milhas GOL',
        amount: 1980.00,
        miles: 18000,
        date: '08/06/2023',
        time: '17:10',
        status: 'completed'
      }
    ])

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      try {
        return new Date(dateString).toLocaleDateString('pt-BR')
      } catch (error) {
        return 'N/A'
      }
    }

    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return 'N/A'
      try {
        return new Date(dateTimeString).toLocaleString('pt-BR')
      } catch (error) {
        return 'N/A'
      }
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

    const getTransactionTypeClass = (type) => {
      const types = {
        purchase: { 
          bg: 'bg-blue-500',
          icon: 'purchase'
        },
        transfer: { 
          bg: 'bg-purple-500',
          icon: 'transfer'
        },
        deposit: { 
          bg: 'bg-green-500',
          icon: 'deposit'
        },
        withdrawal: { 
          bg: 'bg-yellow-500',
          icon: 'withdrawal'
        }
      }
      return types[type] || { bg: 'bg-gray-500', icon: 'transfer' }
    }

    const handleLogout = async () => {
      try {
        await authService.logout()
        router.push('/')
      } catch (err) {
        console.error('Erro ao fazer logout:', err)
        error.value = 'Erro ao fazer logout. Tente novamente.'
      }
    }

    // Carregar dados do dashboard da API Moblix
    const loadDashboardData = async () => {
      try {
        isLoading.value = true
        const data = await moblixService.getDashboardData()
        dashboardData.value = data
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err)
        error.value = 'Não foi possível carregar os dados do dashboard'
      } finally {
        isLoading.value = false
      }
    }

    // Carregar informações da sessão
    const loadSessionInfo = async () => {
      try {
        // Verificar autenticação usando o authService
        const isAuthenticated = await authService.checkAuth()
        
        if (!isAuthenticated) {
          console.log('[Dashboard] Usuário não autenticado, redirecionando para login...')
          router.push({ name: 'Login', query: { redirect: '/dashboard' } })
          return
        }
        
        console.log('[Dashboard] Usuário autenticado')
        
        // Carregar informações da sessão
        console.log('[Dashboard] Carregando informações da sessão...')
        sessionInfo.value = await authService.getSessionInfo()
        
        // Carregar dados do dashboard
        await loadDashboardData()
        
        // Forçar atualização do perfil do usuário
        try {
          await authService.loadUserProfile(authService.currentUser?.value?.id)
        } catch (profileError) {
          console.warn('[Dashboard] Aviso ao carregar perfil:', profileError)
        }
        
      } catch (err) {
        console.error('[Dashboard] Erro ao carregar informações da sessão:', err)
        error.value = 'Erro ao carregar informações do usuário. Tente atualizar a página.'
        // Redirecionar para login em caso de erro
        router.push({ name: 'Login', query: { redirect: '/dashboard' } })
      } finally {
        isLoading.value = false
      }
    }
    
    // Verificar autenticação e carregar dados ao montar o componente
    onMounted(() => {
      loadSessionInfo()
    })
    
    // Observar mudanças na autenticação
    watch(isAuthenticated, (newVal) => {
      if (!newVal) {
        console.log('[Dashboard] Sessão expirada, redirecionando para login...')
        router.push({ name: 'Login', query: { redirect: '/dashboard' } })
      }
    })

    // Função auxiliar para formatar número com separadores de milhar
    const formatNumber = (number) => {
      return new Intl.NumberFormat('pt-BR').format(number)
    }

    // Função para obter a classe CSS baseada na tendência (positiva/negativa)
    const getTrendClass = (value) => {
      return value >= 0 ? 'text-green-600' : 'text-red-600'
    }

    // Função para obter o ícone de tendência (seta para cima/baixo)
    const getTrendIcon = (value) => {
      return value >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'
    }

    return {
      userProfile,
      userInitials,
      sessionInfo,
      recentTransactions,
      selectedPeriod,
      isLoading,
      error,
      showProfileDropdown,
      dashboardData,
      formatDate,
      formatDateTime,
      formatCurrency,
      formatNumber,
      getTrendClass,
      getTrendIcon,
      getTransactionTypeClass,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do dashboard */

.transaction-card {
  transition: all 0.2s ease-in-out;
}

.transaction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.summary-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Animações */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Responsividade */
@media (max-width: 768px) {
  .summary-card {
    margin-bottom: 1rem;
  }
}

.dashboard {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
