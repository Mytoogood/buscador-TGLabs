import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css' 
import { createPinia } from 'pinia'
import { getSupabase } from './config/supabase'
import authService from './services/authService'
import supabasePlugin from './config/supabase'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

// Cria o app Vue
const app = createApp(App)

// Adiciona o Pinia
const pinia = createPinia()
app.use(pinia)

// Adiciona o router
app.use(router)

// Adiciona o plugin do Supabase
app.use(supabasePlugin)

// Adiciona o plugin de notificações
app.use(ToastPlugin, {
  position: 'top-right',
  duration: 5000
})

// Inicializa o serviço de autenticação
const initApp = async () => {
  try {
    console.log('Inicializando aplicação...')
    
    // Garante que o Supabase está disponível
    const supabase = getSupabase()
    if (!supabase) {
      throw new Error('Falha ao inicializar o Supabase')
    }
    
    console.log('Supabase inicializado com sucesso')
    
    // Inicializa o serviço de autenticação
    console.log('Inicializando serviço de autenticação...')
    const isAuthenticated = await authService.initAuth()
    console.log('Estado de autenticação inicial:', isAuthenticated)
    
    // Monta o app
    console.log('Montando aplicação...')
    app.mount('#app')
    
    console.log('Aplicação inicializada com sucesso!')
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error)
  }
}

// Inicia a aplicação
initApp()

