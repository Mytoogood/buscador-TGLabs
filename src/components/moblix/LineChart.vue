<template>
  <div class="relative">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';

// Registra os componentes necessários do Chart.js
Chart.register(...registerables);

export default {
  name: 'LineChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              drawBorder: false,
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value);
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: '#6B7280'
            }
          }
        }
      })
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }

      if (chartCanvas.value) {
        const ctx = chartCanvas.value.getContext('2d');
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: props.chartData,
          options: props.options
        });
      }
    };

    onMounted(() => {
      renderChart();
    });

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    // Atualiza o gráfico quando os dados mudam
    watch(
      () => props.chartData,
      () => {
        renderChart();
      },
      { deep: true }
    );

    return {
      chartCanvas
    };
  }
};
</script>
