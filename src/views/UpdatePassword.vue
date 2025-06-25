<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-16 w-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <span class="text-3xl">🔒</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Criar nova senha
        </h2>
        <p class="mt-2 text-center text-sm text-blue-100">
          Digite e confirme sua nova senha
        </p>
      </div>

      <div v-if="successMessage" class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {{ errorMessage }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleUpdatePassword">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-white mb-1">
              Nova senha
            </label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              minlength="6"
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            >
            <p class="mt-1 text-xs text-gray-300">Mínimo de 6 caracteres</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-white mb-1">
              Confirme a nova senha
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              minlength="6"
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !passwordsMatch"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors duration-200"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading || !passwordsMatch }"
          >
            <span v-if="!isLoading">Atualizar senha</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Atualizando...
            </span>
          </button>
        </div>
      </form>

      <div class="text-center text-sm mt-4">
        <router-link to="/login" class="text-yellow-300 hover:text-yellow-200 underline">
          Voltar para o login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const accessToken = ref('')

// Verifica se as senhas coincidem
const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value && password.value.length >= 6
})

// Verifica se há um token de acesso na URL
onMounted(async () => {
  try {
    // Verifica se há um token na URL (para fluxo PKCE)
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const type = params.get('type')
      
      // Se for um fluxo de recuperação de senha
      if (type === 'recovery' && accessToken && refreshToken) {
        // Tenta fazer login com o token
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        
        if (error) throw error
        
        // Limpa a URL para remover os tokens
        window.history.replaceState({}, document.title, '/update-password')
        return
      }
    }
    
    // Verifica se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      // Se não estiver autenticado, redireciona para o login
      router.push('/login')
    }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    router.push('/login')
  }
})

const handleUpdatePassword = async () => {
  if (!passwordsMatch.value) {
    errorMessage.value = 'As senhas não coincidem ou são muito curtas.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Atualiza a senha
    const { error } = await supabase.auth.updateUser({
      password: password.value
    })

    if (error) throw error

    // Faz logout para limpar a sessão
    await supabase.auth.signOut()

    successMessage.value = 'Senha atualizada com sucesso! Redirecionando para o login...'
    
    // Redireciona para o login após 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error)
    
    // Trata erros específicos
    if (error.message.includes('Auth session missing')) {
      errorMessage.value = 'Sessão expirada. Por favor, solicite um novo link de redefinição.'
    } else if (error.message.includes('Password should be at least 6 characters')) {
      errorMessage.value = 'A senha deve ter pelo menos 6 caracteres.'
    } else {
      errorMessage.value = 'Ocorreu um erro ao atualizar a senha. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
