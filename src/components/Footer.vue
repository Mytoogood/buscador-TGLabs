<template>
  <footer class="bg-primary-900 border-t border-primary-700">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <!-- Logo e Descrição -->
        <div class="md:col-span-5">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <span class="text-white text-xl">✈️</span>
            </div>
            <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-accent-light">
              Júlio Martins
            </span>
          </div>
          <p class="text-accent-light/80 max-w-lg text-sm leading-relaxed">
            Especialista em milhas e viagens. Transformando sonhos em experiências inesquecíveis desde 2008, 
            com mais de 100 milhões de milhas acumuladas e milhares de viajantes orientados a realizarem seus sonhos.
          </p>
          <div class="mt-6 flex space-x-4">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.href" 
              class="group relative w-10 h-10 flex items-center justify-center rounded-full bg-primary-800/40 backdrop-blur-sm border border-primary-700/50 hover:border-secondary-500/50 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary-900/20"
              :class="{
                'hover:bg-gradient-to-br hover:from-pink-600/20 hover:to-purple-600/20': social.name === 'Instagram',
                'hover:bg-gradient-to-br hover:from-red-600/20 hover:to-red-800/20': social.name === 'YouTube',
                'hover:bg-gradient-to-br hover:from-cyan-500/20 hover:to-fuchsia-600/20': social.name === 'TikTok',
                'hover:bg-gradient-to-br hover:from-emerald-500/20 hover:to-emerald-700/20': social.name === 'WhatsApp'
              }"
              :aria-label="social.name"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="relative z-10 w-5 h-5 text-accent-light/70 group-hover:text-white transition-colors duration-300">
                <div v-html="social.icon.template"></div>
              </div>
              <span class="absolute -bottom-7 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-primary-800/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity duration-300">
                {{ social.name }}
              </span>
            </a>
          </div>
        </div>

        <!-- Serviços -->
        <div class="md:col-span-3">
          <h3 class="text-sm font-semibold text-accent-light/90 uppercase tracking-wider mb-4 relative pb-2">
            <span class="relative inline-block">
              Serviços
              <span class="absolute bottom-0 left-0 w-8 h-0.5 bg-secondary-500 rounded-full"></span>
            </span>
          </h3>
          <ul class="space-y-3">
            <li>
              <router-link 
                to="/consultoria" 
                class="flex items-center text-accent-light/80 hover:text-secondary-400 transition-colors duration-300 group"
              >
                <span class="w-1.5 h-1.5 bg-secondary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span>Consultoria</span>
              </router-link>
            </li>
            <li>
              <a 
                href="#" 
                class="flex items-center text-accent-light/80 hover:text-secondary-400 transition-colors duration-300 group"
              >
                <span class="w-1.5 h-1.5 bg-secondary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span>Treinamentos</span>
              </a>
            </li>
            <li>
              <a 
                href="#" 
                class="flex items-center text-accent-light/80 hover:text-secondary-400 transition-colors duration-300 group"
              >
                <span class="w-1.5 h-1.5 bg-secondary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span>Grupo Exclusivo</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Links -->
        <div class="md:col-span-3">
          <h3 class="text-sm font-semibold text-accent-light/90 uppercase tracking-wider mb-4 relative pb-2">
            <span class="relative inline-block">
              Links Rápidos
              <span class="absolute bottom-0 left-0 w-8 h-0.5 bg-secondary-500 rounded-full"></span>
            </span>
          </h3>
          <ul class="space-y-3">
            <li>
              <a 
                href="https://www.instagram.com/juliomartins__/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex items-center text-accent-light/80 hover:text-secondary-400 transition-colors duration-300 group"
              >
                <span class="w-1.5 h-1.5 bg-secondary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span>Instagram</span>
                <svg class="w-3.5 h-3.5 ml-2 text-accent-light/60 group-hover:text-secondary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </li>
            <li>
              <a 
                href="#" 
                class="flex items-center text-accent-light/80 hover:text-secondary-400 transition-colors duration-300 group"
              >
                <span class="w-1.5 h-1.5 bg-secondary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span>Alertas Imperdíveis</span>
              </a>
            </li>
            <li>
              <a 
                href="#" 
                class="flex items-center text-accent-light/80 hover:text-secondary-400 transition-colors duration-300 group"
              >
                <span class="w-1.5 h-1.5 bg-secondary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span>Fale Comigo</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Rodapé inferior -->
      <div class="mt-12 pt-6 border-t border-primary-700">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-accent-light/60 text-xs md:text-sm text-center md:text-left">
            © {{ currentYear }} Júlio Martins | Milhas & Viagens. Todos os direitos reservados.
          </p>
          <div class="mt-3 md:mt-0 flex items-center space-x-4">
            <a 
              href="#" 
              class="text-accent-light/60 hover:text-accent-light/80 text-xs transition-colors duration-300"
            >
              Termos de Uso
            </a>
            <span class="text-accent-light/30">•</span>
            <a 
              href="#" 
              class="text-accent-light/60 hover:text-accent-light/80 text-xs transition-colors duration-300"
            >
              Política de Privacidade
            </a>
            <span class="text-accent-light/30">•</span>
            <a 
              href="#" 
              class="text-accent-light/60 hover:text-accent-light/80 text-xs transition-colors duration-300"
            >
              Cookies
            </a>
          </div>
        </div>
        <div class="mt-3 text-center md:text-right">
          <p class="text-accent-light/40 text-xs">
            Feito com <span class="text-secondary-400">❤️</span> usando Vue.js e Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Footer',
  setup() {
    const currentYear = computed(() => new Date().getFullYear())
    
    const socialLinks = [
      {
        name: 'Instagram',
        href: 'https://www.instagram.com/juliomartins__/',
        icon: {
          template: `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="18" cy="6" r="1" fill="currentColor"/>
            </svg>
          `
        }
      },
      {
        name: 'YouTube',
        href: 'https://www.youtube.com/@juliomartinsmilhas',
        icon: {
          template: `
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          `
        }
      },
      {
        name: 'TikTok',
        href: 'https://www.tiktok.com/@juliomartinsmilhas',
        icon: {
          template: `
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 0C5.6 0 0 5.6 0 12.5S5.6 25 12.5 25 25 19.4 25 12.5 19.4 0 12.5 0zm6.4 9.3c-.5 0-1-.1-1.5-.2v6.3c0 4.1-3.4 7.5-7.5 7.5S2.5 19.5 2.5 15.4s3.4-7.5 7.5-7.5h1.3V12c-.4-.2-.9-.3-1.3-.3-2.1 0-3.8 1.7-3.8 3.8 0 2.1 1.7 3.8 3.8 3.8s3.8-1.7 3.8-3.8V6.6c.5.2 1 .3 1.5.3h.8v2.4h-.8z"/>
            </svg>
          `
        }
      },
      {
        name: 'WhatsApp',
        href: 'https://api.whatsapp.com/message/JWDP3GJGOFWAB1?autoload=1&app_absent=0',
        icon: {
          template: `
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm4.6 14.6c-.25.71-1.26 1.3-1.98 1.48-.57.15-1.32.27-3.86-1.05-3.32-1.73-5.43-5.98-5.6-6.25-.17-.27-.13-.64.09-.88.18-.19.41-.3.67-.3.08 0 .15.01.23.02.27.03.65.16.93.33.27.17 1.75 1.13 2.01 1.29.27.16.45.25.51.41.07.16.04.37-.04.57-.08.2-.36.68-.5.91-.14.23-.29.27-.53.16-.25-.1-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.37-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.23.24-.39.08-.16.04-.3-.01-.41-.05-.11-.45-1.09-.62-1.49-.16-.39-.33-.34-.45-.35-.12-.01-.26-.01-.39-.01-.14 0-.36.05-.55.25-.19.2-.73.71-.73 1.74s.75 2.02.85 2.16c.11.14 1.47 2.25 3.56 3.15.5.22.89.35 1.19.45.5.17.95.15 1.31.09.39-.07 1.17-.48 1.34-.95.17-.47.17-.87.12-.95-.05-.09-.19-.14-.4-.24-.2-.1-1.17-.58-1.35-.64-.18-.06-.3-.09-.43.09-.13.18-.5.63-.61.76-.11.13-.23.14-.42.05-.2-.1-.83-.31-1.58-.99-.58-.52-.97-1.16-1.09-1.36-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.36.1-.12.13-.2.2-.34.07-.14.04-.26.02-.36-.02-.09-.45-1.08-.61-1.47-.16-.39-.32-.34-.45-.34-.12 0-.26-.01-.4-.01z"/>
            </svg>
          `
        }
      },
      {
        name: 'WhatsApp',
        href: 'https://api.whatsapp.com/message/JWDP3GJGOFWAB1?autoload=1&app_absent=0',
        icon: {
          template: `
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm4.6 14.6c-.25.71-1.26 1.3-1.98 1.48-.57.15-1.32.27-3.86-1.05-3.32-1.73-5.43-5.98-5.6-6.25-.17-.27-.13-.64.09-.88.18-.19.41-.3.67-.3.08 0 .15.01.23.02.27.03.65.16.93.33.27.17 1.75 1.13 2.01 1.29.27.16.45.25.51.41.07.16.04.37-.04.57-.08.2-.36.68-.5.91-.14.23-.29.27-.53.16-.25-.1-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.37-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.23.24-.39.08-.16.04-.3-.01-.41-.05-.11-.45-1.09-.62-1.49-.16-.39-.33-.34-.45-.35-.12-.01-.26-.01-.39-.01-.14 0-.36.05-.55.25-.19.2-.73.71-.73 1.74s.75 2.02.85 2.16c.11.14 1.47 2.25 3.56 3.15.5.22.89.35 1.19.45.5.17.95.15 1.31.09.39-.07 1.17-.48 1.34-.95.17-.47.17-.87.12-.95-.05-.09-.19-.14-.4-.24-.2-.1-1.17-.58-1.35-.64-.18-.06-.3-.09-.43.09-.13.18-.5.63-.61.76-.11.13-.23.14-.42.05-.2-.1-.83-.31-1.58-.99-.58-.52-.97-1.16-1.09-1.36-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.36.1-.12.13-.2.2-.34.07-.14.04-.26.02-.36-.02-.09-.45-1.08-.61-1.47-.16-.39-.32-.34-.45-.34-.12 0-.26-.01-.4-.01z"/>
            </svg>
          `
        }
      }
    ]

    return {
      currentYear,
      socialLinks
    }
  }
}
</script>

