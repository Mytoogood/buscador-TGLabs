import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import About from '@/views/About.vue'
import AreaLogada from '@/views/AreaLogada.vue'
import MoblixExplorer from '@/views/MoblixExplorer.vue'
import FaleComigo from '@/views/FaleComigo.vue'
import AlertasImperdiveis from '@/views/AlertasImperdiveis.vue'
import Treinamentos from '@/views/Treinamentos.vue'
import authService from '@/services/authService.js'
import { getSupabase } from '@/config/supabase'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home - Júlio Martins | Milhas & Viagens'
    }
  },
  {
    path: '/sobre',
    name: 'Sobre',
    component: About,
    meta: {
      title: 'Sobre - Júlio Martins | Milhas & Viagens'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Cadastro - Júlio Martins | Milhas & Viagens',
      requiresGuest: true
    }
  },
  {
    path: '/moblix-explorer',
    name: 'MoblixExplorer',
    component: MoblixExplorer,
    meta: {
      title: 'Explorador Moblix - Júlio Martins | Milhas & Viagens',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login - Júlio Martins | Milhas & Viagens',
      requiresGuest: true
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: {
      title: 'Redefinir Senha - Júlio Martins | Milhas & Viagens',
      requiresGuest: true
    }
  },
  {
    path: '/update-password',
    name: 'UpdatePassword',
    component: () => import('@/views/UpdatePassword.vue'),
    meta: {
      title: 'Atualizar Senha - Júlio Martins | Milhas & Viagens'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - Júlio Martins | Milhas & Viagens',
      requiresAuth: true
    }
  },
  {
    path: '/area-logada',
    name: 'AreaLogada',
    component: AreaLogada,
    meta: {
      title: 'Área Logada - Júlio Martins | Milhas & Viagens',
      requiresAuth: true
    }
  },
  {
    path: '/flights',
    name: 'Flights',
    component: () => import('@/views/Flights.vue'),
    meta: {
      title: 'Busca de Voos - Moblix',
      requiresAuth: true
    }
  },
  {
    path: '/ofertas',
    name: 'FlightOffers',
    component: () => import('@/views/FlightOffers.vue'),
    meta: {
      title: 'Ofertas de Voos - Moblix',
      requiresAuth: true
    }
  },
  {
    path: '/fale-comigo',
    name: 'FaleComigo',
    component: FaleComigo,
    meta: {
      title: 'Fale Comigo - Júlio Martins | Milhas & Viagens'
    }
  },
  {
    path: '/alertas-imperdiveis',
    name: 'AlertasImperdiveis',
    component: AlertasImperdiveis,
    meta: {
      title: 'Alertas Imperdíveis - Júlio Martins | Milhas & Viagens'
    }
  },
  {
    path: '/treinamentos',
    name: 'Treinamentos',
    component: Treinamentos,
    meta: {
      title: 'Treinamentos - Júlio Martins | Milhas & Viagens'
    }
  },
  {
    path: '/consultoria',
    name: 'Consultoria',
    component: () => import('@/views/Consultoria.vue'),
    meta: {
      title: 'Consultoria - Júlio Martins | Milhas & Viagens'
    }
  },
  {
    path: '/grupo-exclusivo',
    name: 'GrupoExclusivo',
    component: () => import('@/views/GrupoExclusivo.vue'),
    meta: {
      title: 'Grupo Exclusivo - Júlio Martins | Milhas & Viagens'
    }
  },
  {
    path: '/dashboard/clients/new',
    name: 'AddClient',
    component: () => import('@/views/AddClient.vue'),
    meta: {
      title: 'Adicionar Cliente - Júlio Martins | Milhas & Viagens',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
let isInitialized = false

// Função para inicialização segura do router
const initializeRouter = async () => {
  if (isInitialized) return
  
  try {
    // Inicializa o cliente Supabase
    const supabase = getSupabase()
    if (!supabase) {
      console.warn('Supabase não está disponível no momento da inicialização do router')
    }
    
    // Inicializa o serviço de autenticação
    await authService.init()
    isInitialized = true
    console.log('Router e autenticação inicializados com sucesso')
  } catch (error) {
    console.error('Erro ao inicializar o router:', error)
    // Não lança o erro para evitar que a aplicação quebre completamente
  }
}

// Inicializa o router
initializeRouter()
router.beforeEach(async (to, from, next) => {
  // Atualizar título da página
  document.title = to.meta.title || 'Júlio Martins | Milhas & Viagens'
  
  try {
    // Garante que o router está inicializado
    if (!isInitialized) {
      await initializeRouter()
    }
    
    // Se ainda não estiver inicializado, tenta continuar de qualquer forma
    if (!authService.isInitialized.value) {
      console.warn('Autenticação ainda não inicializada, tentando continuar...')
    }
    
    // Verificar se a rota requer autenticação
    if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated.value) {
      // Se não estiver autenticado, redireciona para login com o caminho de retorno
      next({ 
        name: 'Login', 
        query: { 
          redirect: to.fullPath !== '/login' ? to.fullPath : undefined 
        } 
      })
      return
    }
    next()
    } 
    // Verificar se a rota é apenas para convidados (não logados)
    else if (to.matched.some(record => record.meta.requiresGuest)) {
      if (authService.isAuthenticated.value) {
        // Se já estiver autenticado, redireciona para a área logada
        next({ name: 'AreaLogada' })
        return
      }
      next()
    } 
    // Para todas as outras rotas
    else {
      next()
    }
  } catch (error) {
    console.error('Erro durante a navegação:', error)
    // Tenta redirecionar para a página inicial em caso de erro
    try {
      next('/')
    } catch (e) {
      console.error('Erro ao redirecionar:', e)
      next(false) // Aborta a navegação se o redirecionamento falhar
    }
  }
})

export default router

