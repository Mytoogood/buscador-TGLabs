<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-16 w-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <span class="text-3xl">🔑</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Redefinir senha
        </h2>
        <p class="mt-2 text-center text-sm text-blue-100">
          Digite seu email para receber um link de redefinição
        </p>
      </div>

      <div v-if="successMessage" class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {{ errorMessage }}
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:z-10 sm:text-sm"
              placeholder="seu@email.com"
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors duration-200"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          >
            <span v-if="!isLoading">Enviar link de redefinição</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleResetPassword = async () => {
  if (!email.value) {
    errorMessage.value = 'Por favor, insira seu email.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/update-password`,
      data: {
        type: 'recovery'
      },
      options: {
        emailRedirectTo: `${window.location.origin}/update-password`
      }
    })

    if (error) throw error

    successMessage.value = `Um link de redefinição de senha foi enviado para ${email.value}. Verifique sua caixa de entrada e a pasta de spam.`
    email.value = ''
  } catch (error) {
    console.error('Erro ao enviar email de redefinição:', error)
    errorMessage.value = error.message || 'Ocorreu um erro ao enviar o email de redefinição. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>
