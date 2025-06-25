<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors">
    <div class="flex flex-col h-full">
      <div class="flex-grow">
        <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
          <span class="text-2xl">{{ icon }}</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ description }}</p>
      </div>
      <div class="mt-6">
        <button 
          @click="$emit('click')"
          class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: '✨'
    },
    buttonText: {
      type: String,
      default: 'Acessar'
    }
  },
  emits: ['click']
};
</script>
