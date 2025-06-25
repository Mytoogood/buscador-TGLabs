<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Júlio Martins
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto animate-slide-up">
            ✈️ Viaje mais, gastando menos com milhas!
          </p>
          <p class="text-lg md:text-xl mb-8 text-blue-200 max-w-4xl mx-auto">
            🚀 Desde 2008, transformando sonhos em viagens
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <a 
              href="https://www.instagram.com/juliomartins__/" 
              target="_blank"
              class="btn-primary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100"
            >
              📸 Instagram
            </a>
            <a 
              href="https://juliomartins.my.canva.site/simple-dark-fashion-bio-link-website-black-and-white-in-modern-style" 
              target="_blank"
              class="btn-primary text-lg px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600"
            >
              ✈️ Consultoria Exclusiva
            </a>
          </div>
        </div>
      </div>
      
      <!-- Animated Background Elements -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg class="relative block w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="white"></path>
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Júlio Martins | Milhas & Viagens
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Um dos maiores especialistas em milhas e viagens do Brasil. Empreendedor digital com mais de 100 milhões de milhas acumuladas.
          </p>
        </div>

        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Experiência Card -->
            <div class="card card-hover">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-sky-500 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-white text-2xl">✈️</span>
                </div>
                <h3 class="text-2xl font-bold text-gray-900">Experiência</h3>
              </div>
              
              <p class="text-gray-600 mb-6">
                Mais de 15 anos de experiência no universo das milhas e viagens:
              </p>
              
              <ul class="space-y-3 mb-8">
                <li v-for="feature in experienciaFeatures" :key="feature" class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- Serviços Card -->
            <div class="card card-hover">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-white text-2xl">🎯</span>
                </div>
                <h3 class="text-2xl font-bold text-gray-900">Serviços</h3>
              </div>
              
              <p class="text-gray-600 mb-6">
                Soluções completas para você dominar o mundo das milhas:
              </p>
              
              <ul class="space-y-3 mb-8">
                <li v-for="service in servicosFeatures" :key="service" class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">{{ service }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Bio completa -->
          <div class="mt-16 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-8">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Quem é Júlio Martins?</h3>
              <div class="max-w-4xl mx-auto space-y-4 text-lg text-gray-700">
                <p>
                  Júlio Martins é um dos maiores especialistas em milhas e viagens do Brasil. Empreendedor digital, acumulou 
                  mais de <strong>100 milhões de milhas</strong> ao longo de sua trajetória e já viajou para mais de 
                  <strong>70 países</strong>, sempre em classe executiva e primeira classe, usando milhas.
                </p>
                <p>
                  Desde 2008, dedica-se a transformar sonhos em viagens, ajudando milhares de pessoas a aproveitarem ao máximo 
                  o universo das milhas e dos cartões de crédito. Hoje, já são mais de <strong>10.000 membros</strong> 
                  viajando pelo mundo com sua orientação e estratégias exclusivas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que Escolher as Estratégias do Júlio?
          </h2>
          <p class="text-xl text-gray-600">
            Benefícios exclusivos que transformarão sua forma de viajar
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="benefit in benefits" 
            :key="benefit.title"
            class="text-center group"
          >
            <div class="w-20 h-20 mx-auto mb-6 p-4 bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div class="w-full h-full flex items-center justify-center">
                <span class="text-3xl">{{ benefit.icon }}</span>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ benefit.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ benefit.description }}</p>
          </div>
        </div>

        <!-- Testimonial Card -->
        <div class="mt-16 bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl p-8 text-white text-center">
          <div class="max-w-4xl mx-auto">
            <blockquote class="text-xl md:text-2xl font-medium mb-6">
              "Graças ao Júlio, já viajei para 15 países em classe executiva gastando apenas as milhas que acumulei. 
              Transformou completamente minha forma de viajar!"
            </blockquote>
            <div class="flex items-center justify-center">
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <span class="text-2xl">👤</span>
              </div>
              <div class="text-left">
                <p class="font-semibold">Maria Silva</p>
                <p class="text-blue-200 text-sm">Membro há 3 anos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Pronto para Viajar Mais Gastando Menos?
        </h2>
        <p class="text-xl mb-8 text-blue-100">
          Junte-se aos mais de 10.000 membros que já viajam pelo mundo com as estratégias do Júlio Martins
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://www.instagram.com/juliomartins__/" 
            target="_blank"
            class="btn-primary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100"
          >
            📱 Siga no Instagram
          </a>
          <a 
            href="https://juliomartins.my.canva.site/simple-dark-fashion-bio-link-website-black-and-white-in-modern-style" 
            target="_blank"
            class="btn-primary text-lg px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600"
          >
            ✈️ Consultoria Exclusiva
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Home',
  setup() {
    const experienciaFeatures = ref([
      'Mais de 100 milhões de milhas acumuladas',
      'Viagens para mais de 70 países',
      'Sempre em classe executiva e primeira classe',
      'Desde 2008 no mercado de milhas',
      'Mais de 10.000 membros orientados'
    ])

    const servicosFeatures = ref([
      'Consultoria personalizada em milhas',
      'Treinamentos especializados',
      'Alertas de promoções imperdíveis',
      'Grupo gratuito de milhas & viagens',
      'Estratégias exclusivas de acúmulo'
    ])


    const benefits = ref([
      {
        title: 'Economia Real',
        icon: '💰',
        description: 'Economize até 90% em passagens internacionais usando milhas estratégicas'
      },
      {
        title: 'Classe Executiva',
        icon: '✈️',
        description: 'Viaje com conforto total em classe executiva e primeira classe'
      },
      {
        title: 'Suporte Exclusivo',
        icon: '🎯',
        description: 'Acompanhamento personalizado e estratégias adaptadas ao seu perfil'
      },
      {
        title: 'Comunidade Ativa',
        icon: '👥',
        description: 'Acesso ao grupo exclusivo com mais de 10.000 viajantes experientes'
      }
    ])

    return {
      experienciaFeatures,
      servicosFeatures,
      benefits
    }
  }
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>

