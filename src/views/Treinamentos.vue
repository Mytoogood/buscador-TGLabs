<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-secondary-800">
    <header class="bg-transparent">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <h1 class="text-4xl font-bold text-white">
          🎓 Treinamentos
        </h1>
        <p class="text-blue-200 text-lg mt-1">
          Aprenda tudo sobre milhas e viagens!
        </p>
      </div>
    </header>

    <main class="py-12">
      <div class="max-w-5xl mx-auto bg-white/10 backdrop-blur rounded-xl shadow-xl p-8">
        <h2 class="text-3xl font-bold text-white mb-6">Cursos Disponíveis</h2>
        <p class="text-lg text-blue-100 mb-6">
          Escolha um treinamento e transforme suas viagens.
        </p>
        <ul class="space-y-4">
          <li class="flex items-center justify-between px-4 py-5 bg-white/20 rounded-lg">
            <div class="flex items-center">
              <span class="text-orange-400 text-2xl mr-4">⚡</span>
              <h3 class="text-xl font-bold text-white">Milhas Básico</h3>
            </div>
            <button class="ml-6 px-4 py-2 text-base font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105">
              Saber mais
            </button>
          </li>
          <li class="flex items-center justify-between px-4 py-5 bg-white/20 rounded-lg">
            <div class="flex items-center">
              <span class="text-orange-400 text-2xl mr-4">⚡</span>
              <h3 class="text-xl font-bold text-white">Milhas Avançado</h3>
            </div>
            <button class="ml-6 px-4 py-2 text-base font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105">
              Saber mais
            </button>
          </li>
          <li class="flex items-center justify-between px-4 py-5 bg-white/20 rounded-lg">
            <div class="flex items-center">
              <span class="text-orange-400 text-2xl mr-4">⚡</span>
              <h3 class="text-xl font-bold text-white">Viagens Econômicas</h3>
            </div>
            <button class="ml-6 px-4 py-2 text-base font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105">
              Saber mais
            </button>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Treinamentos',
}
</script>

<style scoped>
/* Estilos específicos do componente */
</style>
