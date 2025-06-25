<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Seção de Teste do Supabase -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Teste de Conexão com Supabase</h1>
        <TestSupabase />
      </div>
      
      <!-- Seção de Estilos Tailwind -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Cores do Tema</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="h-20 rounded-lg bg-primary-500 flex items-center justify-center text-white">Primary</div>
          <div class="h-20 rounded-lg bg-secondary-500 flex items-center justify-center text-white">Secondary</div>
          <div class="h-20 rounded-lg bg-accent-500 flex items-center justify-center text-white">Accent</div>
          <div class="h-20 rounded-lg bg-gray-800 flex items-center justify-center text-white">Dark</div>
        </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Botões</h2>
        <div class="flex flex-wrap gap-4">
          <button class="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
            Botão Primário
          </button>
          <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
            Botão Secundário
          </button>
          <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
            Botão Outline
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Formulário</h2>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Digite seu nome">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="seu@email.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
            <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" rows="4" placeholder="Sua mensagem..."></textarea>
          </div>
          <button type="submit" class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
            Enviar Mensagem
          </button>
        </form>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import TestSupabase from '@/components/TestSupabase.vue';

export default {
  name: 'TestPage',
  components: {
    TestSupabase
  }
}
</script>
