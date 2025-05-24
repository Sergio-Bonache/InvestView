<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  portfolio: {
    type: Array,
    required: true
  }
});

const chartRef = ref(null);
let chart = null;

const chartData = computed(() => {
  const labels = props.portfolio.map(item => item.name);
  const data = props.portfolio.map(item => parseFloat(item.total_quantity));
  
  return {
    labels,
    datasets: [{
      label: 'Valor por activo',
      data,
      backgroundColor: [
        '#1E88E5', // Azul brillante
        '#00ACC1', // Turquesa
        '#43A047', // Verde esmeralda
        '#7CB342', // Verde lima
        '#FDD835', // Amarillo brillante
        '#FB8C00', // Naranja brillante
        '#E53935', // Rojo vibrante
        '#8E24AA', // Púrpura
        '#3949AB', // Índigo
        '#00897B', // Verde azulado
        '#FFA000', // Ámbar
        '#6A1B9A', // Púrpura profundo
        '#2E7D32', // Verde bosque
        '#F57F17', // Amarillo dorado
        '#C62828', // Rojo profundo
        '#1565C0', // Azul marino
        '#00BFA5', // Verde turquesa
        '#FFC107', // Amarillo ámbar
        '#FF6F00', // Naranja intenso
        '#6A1B9A'  // Púrpura profundo
      ],
      borderWidth: 1
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 14
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.label}: ${context.parsed.toFixed(2)}€`;
        }
      }
    }
  }
};

onMounted(() => {
  if (chartRef.value) {
    chart = new Chart(chartRef.value, {
      type: 'doughnut',
      data: chartData.value,
      options: chartOptions
    });
  }
});

// Observar cambios en los datos del portafolio
watch(() => props.portfolio, () => {
  if (chart) {
    chart.data = chartData.value;
    chart.update();
  }
}, { deep: true });
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Distribución del Portafolio</h2>
    
    <div class="h-80">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template> 