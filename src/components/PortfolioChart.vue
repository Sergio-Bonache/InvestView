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
        '#1E88E5',
        '#00ACC1',
        '#43A047',
        '#7CB342',
        '#FDD835',
        '#FB8C00',
        '#E53935',
        '#8E24AA',
        '#3949AB',
        '#00897B',
        '#FFA000',
        '#6A1B9A',
        '#2E7D32',
        '#F57F17',
        '#C62828',
        '#1565C0',
        '#00BFA5',
        '#FFC107',
        '#FF6F00',
        '#6A1B9A'
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