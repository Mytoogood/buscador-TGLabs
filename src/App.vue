<template>
  <div id="app" class="min-h-screen bg-primary-900 text-accent-light transition-colors duration-300 w-full">
    <!-- Navigation -->
    <Navbar />
    
    <!-- Main Content -->
    <main class="transition-all duration-300 flex-grow w-full">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
        <router-view v-slot="{ Component }">
          <transition 
            name="page" 
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  }
}
</script>

<style scoped>
/* Animações de transição entre páginas */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>

