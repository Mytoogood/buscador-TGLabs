<template>
  <nav 
    class="sticky top-0 z-50 bg-primary-900/80 backdrop-blur-md border-b border-primary-700/50 transition-all duration-300 hover:bg-primary-900/90 w-full"
    role="navigation"
    aria-label="Navegação principal"
  >
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link 
            to="/" 
            class="flex items-center space-x-3 group"
            aria-label="Página Inicial"
          >
            <div class="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 shadow-lg transform transition-all duration-300 group-hover:from-secondary-400 group-hover:to-secondary-500 group-hover:shadow-secondary-500/20 group-hover:-rotate-6">
              <span class="text-xl">✈️</span>
            </div>
            <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-light to-secondary-400 bg-300% animate-gradient">
              Júlio Martins
            </span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <ul class="flex items-center space-x-1">
            <template v-for="(item, index) in menuItems" :key="`desktop-${index}`">
              <li v-if="item.isRoute" class="relative group">
                <router-link 
                  :to="item.path"
                  class="relative px-4 py-2.5 mx-1 rounded-xl text-sm font-medium transition-all duration-300 flex items-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-secondary-500/50"
                  :class="[
                    $route.path === item.path 
                      ? 'text-white bg-gradient-to-r from-primary-700/30 to-primary-800/20 border border-primary-600/50 shadow-lg shadow-primary-900/30' 
                      : 'text-accent-light/90 hover:text-white hover:bg-primary-800/50'
                  ]"
                  :aria-current="$route.path === item.path ? 'page' : undefined"
                >
                  <component 
                    :is="item.icon" 
                    class="w-5 h-5 mr-2 transition-transform duration-200 group-hover:scale-110"
                    :class="$route.path === item.path ? 'text-secondary-400' : 'text-accent-light/90'"
                  />
                  <span class="relative z-10">{{ item.name }}</span>
                  <span 
                    v-if="$route.path === item.path"
                    class="absolute -top-1 -right-1 flex h-3 w-3"
                  >
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-secondary-500"></span>
                  </span>
                </router-link>
                <div 
                  v-if="$route.path !== item.path"
                  class="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-500 to-transparent transition-all duration-300 group-hover:w-4/5 group-focus:w-4/5 transform -translate-x-1/2"
                  aria-hidden="true"
                ></div>
              </li>
              <li v-else class="relative group">
                <a 
                  :href="item.path"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="relative px-4 py-2.5 mx-1 rounded-xl text-sm font-medium text-accent-light/90 hover:text-white hover:bg-primary-800/50 transition-all duration-300 group flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-secondary-500/50"
                >
                  <component 
                    :is="item.icon" 
                    class="w-5 h-5 mr-2 transition-transform duration-200 group-hover:scale-110"
                  />
                  <span>{{ item.name }}</span>
                  <span class="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg class="w-3.5 h-3.5 text-accent-light/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </a>
              </li>
            </template>
          </ul>
          
          <!-- Auth Section -->
          <div v-if="!isAuthenticated" class="flex items-center space-x-3 ml-4">
            <router-link 
              to="/login"
              class="group relative px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden flex items-center border border-primary-600 hover:border-secondary-400/50 bg-gradient-to-br from-primary-800/50 to-primary-900/30 hover:from-primary-700/50 hover:to-primary-800/30 shadow-sm hover:shadow-secondary-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-secondary-500/50"
              aria-label="Entrar na conta"
            >
              <span class="relative z-10 flex items-center text-accent-light/90 group-hover:text-white transition-colors duration-300">
                <svg class="w-4 h-4 mr-2 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Entrar</span>
              </span>
              <span class="absolute inset-0 bg-gradient-to-r from-secondary-500/5 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"></span>
            </router-link>
            
            <router-link 
              to="/register"
              class="group relative px-5 py-2.5 text-sm rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-400 hover:to-secondary-500 text-primary-900 font-semibold transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] shadow-lg shadow-secondary-500/20 hover:shadow-secondary-500/30 flex items-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-secondary-500/50"
              aria-label="Criar uma conta"
            >
              <span class="relative z-10 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Cadastrar</span>
              </span>
              <span class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"></span>
            </router-link>
          </div>
          
          <!-- User Dropdown -->
          <div v-else class="flex items-center space-x-3 ml-2">
            <div class="relative group">
              <button 
                ref="userMenuButton"
                @click="toggleUserMenu"
                @keydown.esc="closeUserMenu"
                @keydown.down.prevent="handleMenuKeydown($event, 'first')"
                aria-haspopup="menu"
                :aria-expanded="isUserMenuOpen"
                :aria-controls="'user-dropdown-menu'"
                class="flex items-center space-x-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-secondary-500/50 rounded-full"
                id="user-menu-button"
              >
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white font-medium text-sm shadow-md relative" aria-hidden="true">
                  <span v-if="isLoadingProfile" class="absolute inset-0 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  <span :class="{'opacity-0': isLoadingProfile}">
                    {{ userInitials }}
                  </span>
                </div>
                <span class="text-sm font-medium text-accent-light/90 group-hover:text-white transition-colors duration-300">
                  {{ userProfile?.name?.split(' ')[0] || 'Usuário' }}
                  <span class="sr-only">Abrir menu do usuário</span>
                </span>
                <svg 
                  class="w-4 h-4 text-accent-light/60 group-hover:text-accent-light transition-transform duration-200 group-hover:translate-y-0.5" 
                  fill="none" 
                  viewBox="0 0 20 20" 
                  stroke="currentColor"
                  :class="{'rotate-180': isUserMenuOpen}"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                ref="userMenu"
                v-if="isUserMenuOpen"
                :id="'user-dropdown-menu'"
                class="absolute right-0 mt-2 w-56 origin-top-right bg-primary-800 rounded-xl shadow-xl border border-primary-700/50 divide-y divide-primary-700/50 z-50 transition-all duration-200 ease-out"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
                @keydown.tab.exact="handleLastDropdownItemFocus"
                @keydown.esc="closeUserMenu"
                @keydown.down.prevent="handleMenuKeydown($event, 'next')"
                @keydown.up.prevent="handleMenuKeydown($event, 'prev')"
              >
                <div class="px-4 py-3" role="none">
                  <p class="text-sm text-accent-light/90" role="none">Logado como</p>
                  <p class="text-sm font-medium text-white truncate" role="none">
                    {{ userProfile?.email || 'Carregando...' }}
                    <span v-if="isLoadingProfile" class="ml-2 inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  </p>
                </div>
                <div class="py-1" role="none">
                  <router-link 
                    to="/dashboard"
                    role="menuitem"
                    tabindex="-1"
                    class="flex items-center px-4 py-2.5 text-sm text-accent-light/80 hover:bg-primary-700/50 hover:text-white transition-colors duration-200 group focus:outline-none focus:bg-primary-700/50 focus:text-white"
                    @click="closeUserMenu"
                  >
                    <svg class="w-4 h-4 mr-3 text-accent-light/60 group-hover:text-secondary-400 group-focus:text-secondary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard
                  </router-link>
                  <router-link 
                    to="/profile"
                    role="menuitem"
                    tabindex="-1"
                    class="flex items-center px-4 py-2.5 text-sm text-accent-light/80 hover:bg-primary-700/50 hover:text-white transition-colors duration-200 group focus:outline-none focus:bg-primary-700/50 focus:text-white"
                    @click="closeUserMenu"
                  >
                    <svg class="w-4 h-4 mr-3 text-accent-light/60 group-hover:text-secondary-400 group-focus:text-secondary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Meu Perfil
                  </router-link>
                  <router-link 
                    to="/settings"
                    role="menuitem"
                    tabindex="-1"
                    class="flex items-center px-4 py-2.5 text-sm text-accent-light/80 hover:bg-primary-700/50 hover:text-white transition-colors duration-200 group focus:outline-none focus:bg-primary-700/50 focus:text-white"
                    @click="closeUserMenu"
                  >
                    <svg class="w-4 h-4 mr-3 text-accent-light/60 group-hover:text-secondary-400 group-focus:text-secondary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configurações
                  </router-link>
                </div>
                <div class="py-1">
                  <button
                    @click="handleLogout"
                    role="menuitem"
                    tabindex="-1"
                    class="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/30 hover:text-white focus:outline-none focus:bg-red-900/30 focus:text-white transition-colors duration-200 group"
                  >
                    <svg class="w-4 h-4 mr-3 text-red-500/80 group-hover:text-red-400 group-focus:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair da Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center space-x-3">
          <!-- Mobile Auth Info -->
          <div v-if="isAuthenticated" class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white font-medium text-xs mr-2 shadow-md"
              aria-hidden="true">
              {{ userInitials }}
            </div>
            <span class="text-sm text-accent-light/90 font-medium sr-only">
              {{ userProfile?.name?.split(' ')[0] || 'Usuário' }}
            </span>
          </div>
          
          <button 
            @click.stop="toggleMobileMenu"
            @keydown.esc="mobileMenuOpen && closeMobileMenu()"
            class="p-2 rounded-xl hover:bg-primary-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:ring-offset-2 focus:ring-offset-primary-900 relative"
            :class="{'bg-primary-800/50': mobileMenuOpen}"
            :aria-label="mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            aria-haspopup="true"
          >
            <div class="relative w-6 h-5 transform transition-all duration-300" :class="{'rotate-180': mobileMenuOpen}">
              <span 
                class="absolute right-0 top-0 block h-0.5 w-6 bg-accent-light transform transition-all duration-500 ease-in-out" 
                :class="{'rotate-45 h-[2px] w-6 -translate-y-[1px] translate-x-0': mobileMenuOpen, 'translate-y-1.5': !mobileMenuOpen}"
              ></span>
              <span 
                class="absolute right-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-accent-light transform transition-all duration-500 ease-in-out" 
                :class="{'opacity-0': mobileMenuOpen, 'opacity-100': !mobileMenuOpen}"
              ></span>
              <span 
                class="absolute right-0 bottom-0 block h-0.5 bg-accent-light transform transition-all duration-500 ease-in-out" 
                :class="{'-rotate-45 h-[2px] w-6 translate-y-[1px] translate-x-0': mobileMenuOpen, 'translate-y-[-0.4rem] w-5': !mobileMenuOpen}"
              ></span>
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <transition 
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div 
        v-if="mobileMenuOpen" 
        id="mobile-menu"
        class="fixed inset-0 z-40 bg-primary-900/95 backdrop-blur-sm md:hidden overflow-y-auto pt-20 pb-8"
        @click.self="closeMobileMenu"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'mobile-menu-title'"
      >
        <div class="container mx-auto px-4">
          <h2 id="mobile-menu-title" class="sr-only">Menu de navegação</h2>
          
          <!-- User Info (if logged in) -->
          <div v-if="isAuthenticated" class="flex items-center p-4 mb-6 bg-primary-800/30 rounded-xl border border-primary-700/50">
            <div 
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-white font-medium text-base shadow-lg mr-3 flex-shrink-0"
              aria-hidden="true"
            >
              {{ userInitials }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ userProfile?.name || 'Usuário' }}</p>
              <p class="text-xs text-accent-light/70 truncate">{{ userProfile?.email || 'usuario@exemplo.com' }}</p>
            </div>
          </div>
          
          <!-- Navigation Links -->
          <nav class="space-y-1 mb-6" aria-label="Navegação principal">
            <template v-for="(item, index) in menuItems" :key="`mobile-${index}`">
              <router-link 
                v-if="item.isRoute"
                :to="item.path"
                class="block w-full text-left px-4 py-3.5 text-sm font-medium rounded-xl text-accent-light/90 hover:bg-primary-800/50 hover:text-white transition-colors duration-200 group"
                @click="closeMobileMenu"
              >
                <component 
                  :is="item.icon" 
                  class="w-5 h-5 mr-3 text-accent-light/60 group-hover:text-secondary-400 transition-colors"
                  aria-hidden="true"
                />
                {{ item.name }}
              </router-link>
              <a 
                v-else
                :href="item.path"
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full text-left px-4 py-3.5 text-sm font-medium rounded-xl text-accent-light/90 hover:bg-primary-800/50 hover:text-white transition-colors duration-200 group"
                @click="closeMobileMenu"
              >
                <component 
                  :is="item.icon" 
                  class="w-5 h-5 mr-3 text-accent-light/60 group-hover:text-secondary-400 transition-colors"
                  aria-hidden="true"
                />
                {{ item.name }}
                <span class="ml-2 opacity-60" aria-hidden="true">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              </a>
            </template>
          </nav>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'

// Ícones
import { 
  HomeIcon, 
  UserIcon, 
  PhoneIcon, 
  ArrowRightOnRectangleIcon, 
  UserCircleIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
  HomeIcon as BuildingOfficeIcon
} from '@heroicons/vue/24/outline'


export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const mobileMenuOpen = ref(false)
    const isUserMenuOpen = ref(false)
    const userMenuButton = ref(null)
    const userMenu = ref(null)
    const isLoadingProfile = ref(false)
    
    const isAuthenticated = computed(() => authService.isAuthenticated.value)
    const userProfile = computed(() => {
      const profile = authService.getUserProfile()
      // Se não tiver email, tenta carregar do perfil
      if (isAuthenticated.value && (!profile || !profile.email) && !isLoadingProfile.value) {
        loadUserProfile()
      }
      return profile || {}
    })
    
    // Gerar iniciais do usuário para o avatar
    const userInitials = computed(() => {
      if (userProfile.value?.name) {
        return userProfile.value.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      } else if (userProfile.value?.email) {
        return userProfile.value.email[0].toUpperCase()
      }
      return '?'
    })
    
    const menuItems = [
      {
        name: 'Home',
        path: '/',
        icon: HomeIcon,
        isRoute: true
      },
      {
        name: 'Sobre',
        path: '/sobre',
        icon: UserIcon,
        isRoute: true
      },
      {
        name: 'Hotéis',
        path: '/hotels',
        icon: BuildingOfficeIcon, // Usando HomeIcon temporariamente
        isRoute: true
      },
      {
        name: 'Consultoria',
        path: 'https://api.whatsapp.com/message/JWDP3GJGOFWAB1?autoload=1&app_absent=0',
        icon: PhoneIcon,
        isRoute: false
      }
    ]

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }
    
    const handleLogout = async () => {
      try {
        await authService.logout()
        closeMobileMenu()
        router.push('/')
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      }
    }

    // Controlar menu do usuário
    const toggleUserMenu = () => {
      isUserMenuOpen.value = !isUserMenuOpen.value
      if (isUserMenuOpen.value) {
        // Focar no primeiro item do menu quando aberto
        nextTick(() => {
          const firstItem = document.querySelector('[role="menuitem"]')
          if (firstItem) firstItem.focus()
        })
      }
    }
    
    const closeUserMenu = () => {
      isUserMenuOpen.value = false
      // Retornar o foco para o botão do menu ao fechar
      nextTick(() => {
        if (userMenuButton.value) userMenuButton.value.focus()
      })
    }
    
    // Fechar menu ao pressionar Esc
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isUserMenuOpen.value) {
        closeUserMenu()
      }
    }
    
    // Fechar menu ao clicar fora
    const handleClickOutside = (event) => {
      if (mobileMenuOpen.value) {
        const mobileMenu = document.getElementById('mobile-menu')
        if (mobileMenu && !mobileMenu.contains(event.target)) {
          mobileMenuOpen.value = false
        }
      }
      
      if (isUserMenuOpen.value && userMenu.value && !userMenu.value.contains(event.target) && 
          userMenuButton.value && !userMenuButton.value.contains(event.target)) {
        closeUserMenu()
      }
    }
    
    // Gerenciar foco ao navegar com Tab no menu suspenso
    const handleLastDropdownItemFocus = (event) => {
      if (event.shiftKey) return // Se estiver navegando para trás com Shift+Tab
      event.preventDefault()
      closeUserMenu()
    }
    
    // Navegação por teclado no menu
    const handleMenuKeydown = (event, direction) => {
      if (!isUserMenuOpen.value) return
      
      const menuItems = Array.from(
        userMenu.value.querySelectorAll('[role="menuitem"]')
      )
      
      if (!menuItems.length) return
      
      const currentElement = document.activeElement
      let currentIndex = menuItems.indexOf(currentElement)
      
      if (direction === 'first') {
        // Focar no primeiro item
        menuItems[0].focus()
      } else if (direction === 'last') {
        // Focar no último item
        menuItems[menuItems.length - 1].focus()
      } else if (direction === 'next') {
        // Próximo item ou voltar para o primeiro
        const nextIndex = (currentIndex + 1) % menuItems.length
        menuItems[nextIndex].focus()
      } else if (direction === 'prev') {
        // Item anterior ou ir para o último
        const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length
        menuItems[prevIndex].focus()
      }
    }
    
    // Fechar menu quando o foco sair do menu
    const handleFocusOut = (event) => {
      if (isUserMenuOpen.value && userMenu.value && 
          !userMenu.value.contains(event.relatedTarget) && 
          userMenuButton.value && !userMenuButton.value.contains(event.relatedTarget)) {
        closeUserMenu()
      }
    }
    
    // Carregar perfil do usuário
    const loadUserProfile = async () => {
      if (isLoadingProfile.value || !isAuthenticated.value) return
      
      isLoadingProfile.value = true
      try {
        // Tenta carregar o perfil do usuário
        const profile = await authService.refreshUserProfile()
        
        if (!profile) {
          console.warn('Perfil do usuário não encontrado')
          return
        }
        
        console.log('Perfil do usuário carregado:', profile)
      } catch (error) {
        console.error('Erro ao carregar perfil do usuário:', error)
      } finally {
        isLoadingProfile.value = false
      }
    }
    
    // Observar mudanças no estado de autenticação
    const handleAuthChange = async () => {
      if (isAuthenticated.value) {
        await loadUserProfile()
      } else {
        // Limpar estado do usuário quando deslogado
        console.log('Usuário não autenticado, limpando estado...')
      }
    }
    
    // Adicionar/remover event listeners
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      
      // Carregar perfil quando o componente for montado
      handleAuthChange()
      
      // Observar mudanças no estado de autenticação
      const unsubscribe = authService.onAuthStateChange((event) => {
        console.log('Auth state changed:', event)
        handleAuthChange().catch(console.error)
      })
      
      // Limpar listener quando o componente for desmontado
      onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
        
        if (unsubscribe) {
          unsubscribe()
        }
      })
    })
    
    // O cleanup agora é feito dentro do onMounted

    return {
      mobileMenuOpen,
      isUserMenuOpen,
      userMenuButton,
      userMenu,
      menuItems,
      isAuthenticated,
      userProfile,
      userInitials,
      toggleMobileMenu,
      closeMobileMenu,
      toggleUserMenu,
      closeUserMenu,
      handleLogout,
      handleLastDropdownItemFocus,
      handleFocusOut,
      handleMenuKeydown
    }
  }
}
</script>

<style scoped>
/* Animações */
@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Estilos para links ativos */
.router-link-active {
  color: white;
}

/* Estilos para o menu mobile */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Efeito de brilho ao passar o mouse */
.hover-glow {
  position: relative;
  overflow: hidden;
}

.hover-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.5s;
  pointer-events: none;
}

.hover-glow:hover::before {
  left: 100%;
}

/* Estilo para o dropdown do usuário */
.user-dropdown {
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover .user-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Efeito de gradiente animado para o texto */
.animate-gradient {
  background-size: 200% auto;
  animation: gradientFlow 3s ease infinite;
}

/* Ajustes de responsividade */
@media (max-width: 768px) {
  .mobile-menu {
    max-height: calc(100vh - 5rem);
    overflow-y: auto;
  }
  
  .mobile-menu::-webkit-scrollbar {
    width: 6px;
  }
  
  .mobile-menu::-webkit-scrollbar-track {
    background-color: rgba(30, 41, 59, 0.3);
  }
  
  .mobile-menu::-webkit-scrollbar-thumb {
    background-color: rgba(30, 41, 59, 0.5);
    border-radius: 9999px;
  }
}

/* Transições suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.auth-button {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.auth-button:hover {
  background-color: #1d4ed8;
}

.auth-logout {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #dc2626;
  border-radius: 0.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.auth-logout:hover {
  color: #b91c1c;
  background-color: #fef2f2;
}

.mobile-auth-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.mobile-auth-link:hover {
  color: #2563eb;
  background-color: #eff6ff;
}

.mobile-auth-button {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.5rem;
  margin-left: 0.75rem;
  margin-right: 0.75rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.mobile-auth-button:hover {
  background-color: #1d4ed8;
}

.mobile-auth-logout {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: #dc2626;
  border-radius: 0.5rem;
  margin-left: 0.75rem;
  margin-right: 0.75rem;
  width: 100%;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.mobile-auth-logout:hover {
  color: #b91c1c;
  background-color: #fef2f2;
}
</style>

