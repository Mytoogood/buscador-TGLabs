<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '@/services/authService'

const router = useRouter()
const route = useRoute()

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

// Removida verificação de autenticação no onMounted para evitar loops de redirecionamento

const validateForm = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  let isValid = true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!form.email.trim()) {
    errors.email = 'Email é obrigatório'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Email inválido'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'Senha é obrigatória'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
    isValid = false
  }
  
  return isValid
}

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    console.log('[Login] Tentando autenticar:', form.email)
    
    // Realiza o login usando o serviço de autenticação
    const result = await authService.login(
      form.email.trim().toLowerCase(),
      form.password,
      form.rememberMe
    )
    
    console.log('[Login] Resposta do login:', result)
    
    if (!result.success) {
      console.error('[Login] Erro de autenticação:', result.error)
      
      // Tratamento de erros específicos
      if (result.error?.status === 400 || result.error?.message?.includes('Invalid login')) {
        throw new Error('Email ou senha incorretos')
      } else if (result.error?.message?.includes('Email not confirmed')) {
        throw new Error('Por favor, verifique seu email para confirmar sua conta')
      } else if (result.error?.status === 0) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.')
      } else {
        throw new Error(result.error?.message || 'Erro ao fazer login. Tente novamente.')
      }
    }
    
    if (!result.user) {
      console.error('[Login] Nenhum usuário retornado na resposta')
      throw new Error('Erro ao processar o login. Tente novamente.')
    }
    
    console.log('[Login] Autenticação bem-sucedida')
    successMessage.value = 'Login realizado com sucesso! Redirecionando...'
    
    // Pequeno atraso para garantir que a UI seja atualizada
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Navegar para a rota de redirecionamento ou área logada
    const redirectTo = route.query.redirect || '/area-logada'
    console.log(`[Login] Redirecionando para: ${redirectTo}`)
    
    // Forçar atualização do estado de autenticação
    await authService.checkAuth()
    
    // Navegar para a rota desejada
    await router.push(redirectTo)
    
    // Recarregar a página para garantir que todos os dados sejam carregados
    // mas apenas se não estivermos já na rota de destino para evitar loop
    if (window.location.pathname !== redirectTo) {
      window.location.href = redirectTo
    }
    
  } catch (error) {
    console.error('[Login] Erro durante o login:', error)
    
    // Mensagens de erro amigáveis
    if (error.message.includes('senha incorretos')) {
      errorMessage.value = 'Email ou senha incorretos. Verifique seus dados.'
    } else if (error.message.includes('network')) {
      errorMessage.value = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
    } else {
      errorMessage.value = error.message || 'Erro ao fazer login. Tente novamente.'
    }
    
    // Rolar para o topo para mostrar a mensagem de erro
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-16 w-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <span class="text-3xl">✈️</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Boas-vindas de volta!
        </h2>
        <p class="mt-2 text-center text-sm text-blue-100">
          Acesse sua conta para gerenciar suas milhas e viagens
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Email"
              :class="{ 'border-red-500': errors.email }"
            />
            <span v-if="errors.email" class="text-red-300 text-sm mt-1">{{ errors.email }}</span>
          </div>
          
          <div>
            <label for="password" class="sr-only">Senha</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
                placeholder="Senha"
                :class="{ 'border-red-500': errors.password }"
              />
              <span 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="toggleShowPassword"
                style="cursor: pointer;"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l4.242 4.243m-7.533-7.532l3.29-3.29m7.533 7.533l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
            </div>
            <span v-if="errors.password" class="text-red-300 text-sm mt-1">{{ errors.password }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.rememberMe"
              name="remember"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-blue-100">
              Lembrar de mim
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="text-yellow-300 hover:text-yellow-200 underline">
              Esqueceu a senha?
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <svg v-if="!isLoading" class="h-5 w-5 text-yellow-700 group-hover:text-yellow-600 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-blue-100">
            Não tem uma conta? 
            <router-link to="/register" class="text-yellow-300 hover:text-yellow-200 underline">
              Cadastre-se agora
            </router-link>
          </p>
        </div>
      </form>

      <div v-if="successMessage" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>

      <div class="mt-8 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm text-white/80">
        <h4 class="font-semibold mb-2 text-white">💡 Dicas para login:</h4>
        <ul class="space-y-1 list-disc list-inside">
          <li>Primeiro acesso? <router-link to="/register" class="text-blue-300 hover:text-blue-200 font-medium">Crie sua conta aqui</router-link></li>
          <li>Esqueceu sua senha? Use a opção "Esqueci minha senha"</li>
          <li>Não compartilhe suas credenciais</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

button, a, input, .bg-yellow-500 {
  transition: all 0.2s ease-in-out;
}

button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .login-page {
    padding: 1rem;
  }
  
  .max-w-md {
    max-width: 100%;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.bg-green-100 {
  background-color: #f0fdf4;
  border-color: #86efac;
}

.bg-red-100 {
  background-color: #fef2f2;
  border-color: #fca5a5;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

[type='password'] + span {
  cursor: pointer;
}

[type='password'] + span:hover svg {
  color: #9ca3af;
}
</style>
