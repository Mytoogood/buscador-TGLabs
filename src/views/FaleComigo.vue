<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
    <!-- Header Elegante -->
    <header class="bg-primary-900/80 backdrop-blur-md shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">
                📧 Fale Comigo - Júlio Martins
              </h1>
              <p class="text-sm text-accent-light">Entre em contato direto</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/area-logada"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl shadow-md text-primary-700 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Voltar
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Hero Section -->
        <section class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">
            📧 Entre em <span class="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent font-extrabold">Contato Comigo</span>
          </h2>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto">
            Estou aqui para ajudar você a transformar seus sonhos em viagens incríveis
          </p>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Formulário de Contato -->
          <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mr-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">Envie sua Mensagem</h3>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Seu nome completo"
                >
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="seu@email.com"
                >
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Telefone/WhatsApp</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="(11) 99999-9999"
                >
              </div>

              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                <select 
                  id="subject" 
                  v-model="form.subject"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="consultoria">Consultoria em Milhas</option>
                  <option value="treinamento">Treinamentos</option>
                  <option value="parceria">Parcerias</option>
                  <option value="duvida">Dúvidas Gerais</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <textarea 
                  id="message" 
                  v-model="form.message"
                  required
                  rows="5"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Conte-me como posso ajudá-lo..."
                ></textarea>
              </div>

              <button 
                type="submit"
                :disabled="isSubmitting"
                class="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
              </button>
            </form>
          </div>

          <!-- Informações de Contato -->
          <div class="space-y-8">
            <!-- Contatos Diretos -->
            <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
              <div class="flex items-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mr-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900">Contatos Diretos</h3>
              </div>

              <div class="space-y-6">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-xl">📱</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">WhatsApp</p>
                    <a href="https://wa.me/5511999999999" target="_blank" class="text-green-600 hover:text-green-700 transition-colors">
                      (11) 99999-9999
                    </a>
                  </div>
                </div>

                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-xl">📧</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">E-mail</p>
                    <a href="mailto:contato@juliomartins.com.br" class="text-blue-600 hover:text-blue-700 transition-colors">
                      contato@juliomartins.com.br
                    </a>
                  </div>
                </div>

                <div class="flex items-center">
                  <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-xl">📸</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">Instagram</p>
                    <a href="https://www.instagram.com/juliomartins__/" target="_blank" class="text-pink-600 hover:text-pink-700 transition-colors">
                      @juliomartins__
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Horários de Atendimento -->
            <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
              <div class="flex items-center mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900">Horário de Atendimento</h3>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Segunda a Sexta:</span>
                  <span class="text-gray-600">9h às 18h</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Sábado:</span>
                  <span class="text-gray-600">9h às 14h</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Domingo:</span>
                  <span class="text-gray-600">Fechado</span>
                </div>
              </div>

              <div class="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p class="text-sm text-yellow-800">
                  <strong>💡 Dica:</strong> Para atendimento mais rápido, envie uma mensagem pelo WhatsApp ou use o formulário ao lado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'

export default {
  name: 'FaleComigo',
  
  setup() {
    const toast = useToast()
    const isSubmitting = ref(false)
    const form = ref({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
    
    const submitForm = async () => {
      try {
        isSubmitting.value = true
        
        // Simular envio do formulário
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Em uma implementação real, você enviaria os dados para sua API
        console.log('Formulário enviado:', form.value)
        
        toast.success('Mensagem enviada com sucesso! Responderemos em breve.')
        
        // Limpar formulário
        form.value = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        }
      } catch (err) {
        console.error('Erro ao enviar formulário:', err)
        toast.error('Erro ao enviar mensagem. Tente novamente.')
      } finally {
        isSubmitting.value = false
      }
    }
    
    return {
      form,
      isSubmitting,
      submitForm
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do componente */
</style>
