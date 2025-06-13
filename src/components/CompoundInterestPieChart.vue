<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

// Definimos las props que recibirá el componente
const props = defineProps({
  capitalInicial: { type: Number, required: true },
  aportacionesPosteriores: { type: Number, required: true },
  interesesGanados: { type: Number, required: true }
});

const chartRef = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) {
    console.error('No se pudo obtener el contexto 2D del canvas');
    return;
  }

  // Si ya existe una instancia previa se elimina
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Datos y configuración del gráfico
  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Capital Inicial', 'Aportaciones', 'Intereses Ganados'],
      datasets: [{
        data: [props.capitalInicial, props.aportacionesPosteriores, props.interesesGanados],
        backgroundColor: ['#3b82f6', '#E6AA68', '#22c55e'],
        hoverOffset: 15
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 14
            }
          }
        }
      }
    }
  });
};

onMounted(renderChart);
watch(
  () => [props.capitalInicial, props.aportacionesPosteriores, props.interesesGanados],
  renderChart
);
</script>
