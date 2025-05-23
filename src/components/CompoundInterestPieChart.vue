<template>
  <!-- Usa el mismo nombre de ref definido en script -->
  <canvas ref="chartRef"></canvas>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

// Registramos los controladores y elementos necesarios
Chart.register(PieController, ArcElement, Tooltip, Legend);

// Definimos las props que recibirá el componente
const props = defineProps({
  capitalInicial: { type: Number, required: true },
  aportacionesPosteriores: { type: Number, required: true },
  interesesGanados: { type: Number, required: true }
});

// Referencia al elemento canvas
const chartRef = ref(null);
let chartInstance = null;

// Función para (re)dibujar el gráfico
const renderChart = () => {
  if (!chartRef.value) return;

  // Obtenemos el contexto 2D
  const ctx = chartRef.value.getContext('2d');
  if (!ctx) {
    console.error('No se pudo obtener el contexto 2D del canvas');
    return;
  }

  // Si ya existe una instancia previa, la destruimos
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
            // Aumenta tamaño de fuente de la leyenda
            font: {
              size: 14
            }
          }
        }
      }
    }
  });
};

// Montamos y observamos cambios para actualizar
onMounted(renderChart);
watch(
  () => [props.capitalInicial, props.aportacionesPosteriores, props.interesesGanados],
  renderChart
);
</script>
