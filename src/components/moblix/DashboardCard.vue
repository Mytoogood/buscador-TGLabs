<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 truncate">{{ title }}</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">{{ value }}</p>
        <p v-if="trend !== undefined" class="mt-2 flex items-center text-sm" :class="trend >= 0 ? 'text-green-600' : 'text-red-600'">
          <template v-if="trend !== null">
            <svg v-if="trend >= 0" class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
            </svg>
            {{ Math.abs(trend) }}%
          </template>
          <span class="ml-1 text-gray-500">{{ trendLabel }}</span>
        </p>
      </div>
      <div class="ml-4 flex-shrink-0">
        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <span class="text-2xl">{{ icon }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: '📊'
    },
    trend: {
      type: Number,
      default: null
    },
    trendLabel: {
      type: String,
      default: ''
    }
  }
};
</script>
