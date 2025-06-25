<template>
  <div class="register-page min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-white rounded-full flex items-center justify-center">
          <span class="text-2xl">📝</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Cadastre-se
        </h2>
        <p class="mt-2 text-center text-sm text-blue-100">
          Junte-se aos mais de 10.000 membros que viajam pelo mundo!
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="name" class="sr-only">Nome completo</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Nome completo"
              :class="{ 'border-red-500': errors.name }"
            />
            <span v-if="errors.name" class="text-red-300 text-sm mt-1">{{ errors.name }}</span>
          </div>
          
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
            <label for="phone" class="sr-only">Telefone</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Telefone (11) 99999-9999"
              :class="{ 'border-red-500': errors.phone }"
            />
            <span v-if="errors.phone" class="text-red-300 text-sm mt-1">{{ errors.phone }}</span>
          </div>
          
          <div>
            <label for="password" class="sr-only">Senha</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Senha (mínimo 6 caracteres)"
              :class="{ 'border-red-500': errors.password }"
            />
            <span v-if="errors.password" class="text-red-300 text-sm mt-1">{{ errors.password }}</span>
          </div>
          
          <div>
            <label for="confirmPassword" class="sr-only">Confirmar senha</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Confirmar senha"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <span v-if="errors.confirmPassword" class="text-red-300 text-sm mt-1">{{ errors.confirmPassword }}</span>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            name="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-blue-100">
            Aceito os 
            <a href="#" class="text-yellow-300 hover:text-yellow-200 underline">termos de uso</a> 
            e 
            <a href="#" class="text-yellow-300 hover:text-yellow-200 underline">política de privacidade</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="!isLoading">📝 Criar Conta</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando conta...
            </span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-blue-100">
            Já tem uma conta? 
            <router-link to="/login" class="text-yellow-300 hover:text-yellow-200 underline">
              Faça login
            </router-link>
          </p>
        </div>
      </form>

      <!-- Database Status -->
      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
        {{ dbStatus }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import { supabase } from '@/config/supabase'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const isLoading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')
    const dbStatus = ref('Verificando conexão com o banco de dados...')
    
    // Verificar conexão com o Supabase
    onMounted(async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          
        if (error) throw error
        
        dbStatus.value = '✅ Conexão com o banco de dados estabelecida com sucesso!'
        console.log('Conexão com Supabase estabelecida:', data)
      } catch (error) {
        dbStatus.value = '❌ Erro ao conectar ao banco de dados: ' + error.message
        console.error('Erro ao conectar ao Supabase:', error)
      }
    })
    
    const form = reactive({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })
    
    const errors = reactive({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    })

    const validateForm = () => {
      // Reset errors
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
      
      let isValid = true
      
      // Name validation
      if (!form.name.trim()) {
        errors.name = 'Nome é obrigatório'
        isValid = false
      } else if (form.name.trim().length < 2) {
        errors.name = 'Nome deve ter pelo menos 2 caracteres'
        isValid = false
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email.trim()) {
        errors.email = 'Email é obrigatório'
        isValid = false
      } else if (!emailRegex.test(form.email)) {
        errors.email = 'Email inválido'
        isValid = false
      }
      
      // Phone validation
      const phoneRegex = /^\(?[1-9]{2}\)?\s?9?[0-9]{4}-?[0-9]{4}$/
      if (!form.phone.trim()) {
        errors.phone = 'Telefone é obrigatório'
        isValid = false
      } else if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
        errors.phone = 'Telefone inválido'
        isValid = false
      }
      
      // Password validation
      if (!form.password) {
        errors.password = 'Senha é obrigatória'
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres'
        isValid = false
      }
      
      // Confirm password validation
      if (!form.confirmPassword) {
        errors.confirmPassword = 'Confirmação de senha é obrigatória'
        isValid = false
      } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Senhas não coincidem'
        isValid = false
      }
      
      return isValid
    }

    const handleRegister = async () => {
      errorMessage.value = ''
      successMessage.value = ''
      
      if (!validateForm()) {
        return
      }
      
      if (!form.acceptTerms) {
        errorMessage.value = 'Você deve aceitar os termos de uso'
        return
      }
      
      isLoading.value = true
      
      try {
        // Call the register function from authService
        const { success, error, user } = await authService.register({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password
        })
        
        if (success) {
          successMessage.value = 'Conta criada com sucesso! Verifique seu email para confirmar o cadastro.'
          
          // Reset form
          Object.keys(form).forEach(key => {
            if (typeof form[key] === 'boolean') {
              form[key] = false
            } else {
              form[key] = ''
            }
          })
          
          // Redirect to login after success
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          errorMessage.value = error || 'Erro ao criar conta. Tente novamente.'
        }
      } catch (error) {
        console.error('Registration error:', error)
        errorMessage.value = error.message || 'Erro ao criar conta. Tente novamente.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      errors,
      isLoading,
      successMessage,
      errorMessage,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
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
