<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  capitalPrestado: {
    type: Number,
    required: true
  },
  interesesTotales: {
    type: Number,
    required: true
  },
  entrada: {
    type: Number,
    required: true
  }
});

const chartRef = ref(null);
let chart = null;

const createChart = () => {
  const ctx = chartRef.value.getContext('2d');
  
  if (chart) {
    chart.destroy();
  }

  const total = props.capitalPrestado + props.interesesTotales + props.entrada;
  const entradaPorcentaje = (props.entrada / total) * 100;
  const capitalPorcentaje = (props.capitalPrestado / total) * 100;
  const interesesPorcentaje = (props.interesesTotales / total) * 100;

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [
        `Entrada (${entradaPorcentaje.toFixed(1)}%)`,
        `Capital (${capitalPorcentaje.toFixed(1)}%)`,
        `Intereses (${interesesPorcentaje.toFixed(1)}%)`
      ],
      datasets: [{
        data: [props.entrada, props.capitalPrestado, props.interesesTotales],
        backgroundColor: [
          'rgba(0, 122, 255, 0.8)',    // Azul saturado para entrada
          'rgba(52, 199, 89, 0.8)',    // Verde saturado para capital
          'rgba(255, 59, 48, 0.8)'     // Rojo saturado para intereses
        ],
        borderColor: [
          'rgba(0, 122, 255, 1)',
          'rgba(52, 199, 89, 1)',
          'rgba(255, 59, 48, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: 'Distribución del Coste Total',
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value.toLocaleString()}€ (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

watch(
  () => [props.capitalPrestado, props.interesesTotales, props.entrada],
  () => {
    createChart();
  },
  { deep: true }
);

onMounted(() => {
  createChart();
});
</script>

<template>
  <div class="w-full h-96">
    <canvas ref="chartRef"></canvas>
  </div>
</template> 