<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <button 
              @click="$router.go(-1)"
              class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Voltar
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Adicionar Cliente</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Formulário de Adição de Cliente -->
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Informações do Cliente</h2>
          <p class="text-gray-600">Preencha os dados abaixo para adicionar um novo cliente ao sistema.</p>
        </div>

        <!-- Mensagens de Sucesso e Erro -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          {{ successMessage }}
        </div>
        
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Digite o nome completo do cliente"
            >
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Digite o email do cliente"
            >
          </div>

          <!-- Telefone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              @input="handlePhoneInput"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="(11) 99999-9999"
            >
          </div>

          <!-- CPF -->
          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-700 mb-2">
              CPF
            </label>
            <input
              id="cpf"
              v-model="form.cpf"
              type="text"
              @input="handleCpfInput"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="000.000.000-00"
              maxlength="14"
            >
          </div>

          <!-- Data de Nascimento -->
          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">
              Data de Nascimento
            </label>
            <input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
          </div>

          <!-- Endereço -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Rua, número"
              >
            </div>
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Cidade"
              >
            </div>
          </div>

          <!-- Estado e CEP -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="state"
                v-model="form.state"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Selecione o estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
            <div>
              <label for="cep" class="block text-sm font-medium text-gray-700 mb-2">
                CEP
              </label>
              <input
                id="cep"
                v-model="form.cep"
                type="text"
                @input="handleCepInput"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="00000-000"
                maxlength="9"
              >
            </div>
          </div>

          <!-- Observações -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Informações adicionais sobre o cliente..."
            ></textarea>
          </div>

          <!-- Botões de Ação -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!isLoading">Adicionar Cliente</span>
              <span v-else>Adicionando...</span>
            </button>
            <button
              type="button"
              @click="resetForm"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Limpar Formulário
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import clientService from '@/services/clientService'
import authService from '@/services/authService'
import { setupDatabase } from '@/utils/setupDatabase'

export default {
  name: 'AddClient',
  setup() {
    const router = useRouter()
    const isLoading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')
    
    const form = ref({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      birthDate: '',
      address: '',
      city: '',
      state: '',
      cep: '',
      notes: ''
    })

    const errors = reactive({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      general: ''
    })

    const formatCpf = (value) => {
      return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    }

    const formatCep = (value) => {
      return value
        .replace(/\D/g, '')
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
    }

    const formatPhone = (value) => {
      return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
    }

    const validateForm = () => {
      // Limpar erros anteriores
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
      
      let isValid = true
      
      // Validar nome
      if (!form.value.name.trim()) {
        errors.name = 'Nome é obrigatório'
        isValid = false
      } else if (form.value.name.trim().length < 2) {
        errors.name = 'Nome deve ter pelo menos 2 caracteres'
        isValid = false
      }
      
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.value.email.trim()) {
        errors.email = 'Email é obrigatório'
        isValid = false
      } else if (!emailRegex.test(form.value.email)) {
        errors.email = 'Email inválido'
        isValid = false
      }
      
      // Validar CPF (se preenchido)
      if (form.value.cpf && form.value.cpf.replace(/\D/g, '').length !== 11) {
        errors.cpf = 'CPF deve ter 11 dígitos'
        isValid = false
      }
      
      // Validar telefone (se preenchido)
      if (form.value.phone) {
        const phoneDigits = form.value.phone.replace(/\D/g, '')
        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
          errors.phone = 'Telefone deve ter 10 ou 11 dígitos'
          isValid = false
        }
      }
      
      return isValid
    }

    const handleSubmit = async () => {
      errorMessage.value = ''
      successMessage.value = ''
      
      // Validar formulário
      if (!validateForm()) {
        errorMessage.value = 'Por favor, corrija os erros no formulário'
        return
      }
      
      // Verificar se o usuário está autenticado
      if (!authService.isAuthenticated.value) {
        errorMessage.value = 'Você precisa estar logado para adicionar clientes'
        return
      }
      
      isLoading.value = true
      
      try {
        console.log('[AddClient] Enviando dados do cliente:', form.value)
        
        // Preparar dados para envio
        const clientData = {
          name: form.value.name.trim(),
          email: form.value.email.trim().toLowerCase(),
          phone: form.value.phone || null,
          cpf: form.value.cpf || null,
          birthDate: form.value.birthDate || null,
          address: form.value.address || null,
          city: form.value.city || null,
          state: form.value.state || null,
          cep: form.value.cep || null,
          notes: form.value.notes || null
        }
        
        // Criar cliente usando o serviço
        const result = await clientService.createClient(clientData)
        
        if (!result.success) {
          throw new Error(result.error || 'Erro ao criar cliente')
        }
        
        console.log('[AddClient] Cliente criado com sucesso:', result.data)
        
        // Mostrar mensagem de sucesso
        successMessage.value = 'Cliente adicionado com sucesso!'
        
        // Aguardar um pouco para mostrar a mensagem
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Redirecionar para o dashboard
        router.push('/dashboard')
        
      } catch (error) {
        console.error('[AddClient] Erro ao adicionar cliente:', error)
        
        // Tratamento específico de erros
        if (error.message.includes('email já está cadastrado')) {
          errors.email = 'Este email já está cadastrado'
          errorMessage.value = 'Este email já está sendo usado por outro cliente'
        } else if (error.message.includes('dados obrigatórios')) {
          errorMessage.value = 'Verifique se todos os campos obrigatórios estão preenchidos'
        } else {
          errorMessage.value = error.message || 'Erro ao adicionar cliente. Tente novamente.'
        }
        
        // Rolar para o topo para mostrar a mensagem de erro
        window.scrollTo({ top: 0, behavior: 'smooth' })
        
      } finally {
        isLoading.value = false
      }
    }

    const resetForm = () => {
      form.value = {
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birthDate: '',
        address: '',
        city: '',
        state: '',
        cep: '',
        notes: ''
      }
    }

    // Formatação automática nos campos
    const handleCpfInput = (event) => {
      form.value.cpf = formatCpf(event.target.value)
    }

    const handleCepInput = (event) => {
      form.value.cep = formatCep(event.target.value)
    }

    const handlePhoneInput = (event) => {
      form.value.phone = formatPhone(event.target.value)
    }

    // Verificar configuração do banco ao montar o componente
    onMounted(async () => {
      console.log('[AddClient] Verificando configuração do banco de dados...')
      
      try {
        const result = await setupDatabase()
        
        if (!result.success && result.instructions) {
          console.log('📋 CONFIGURAÇÃO NECESSÁRIA:')
          console.log(result.instructions.message)
          console.log('\nSQL para executar:')
          console.log(result.instructions.sql)
          console.log('\nPASSOS:')
          result.instructions.steps.forEach(step => console.log(step))
          
          // Mostrar aviso discreto para o usuário
          errorMessage.value = 'Configuração do banco necessária. Verifique o console (F12) para instruções.'
        } else if (result.success) {
          console.log('✅ Banco de dados configurado corretamente!')
        }
      } catch (error) {
        console.warn('Erro ao verificar banco:', error)
      }
    })

    return {
      form,
      isLoading,
      successMessage,
      errorMessage,
      errors,
      handleSubmit,
      resetForm,
      handleCpfInput,
      handleCepInput,
      handlePhoneInput
    }
  }
}
</script>

<style scoped>
/* Adicionar estilos customizados se necessário */
</style>
