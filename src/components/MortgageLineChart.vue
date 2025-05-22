<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  capitalPendiente: {
    type: Array,
    required: true
  },
  interesesPagados: {
    type: Array,
    required: true
  },
  cuotaMensual: {
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

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: 'Capital Pendiente',
          data: props.capitalPendiente,
          borderColor: 'rgba(52, 199, 89, 1)',
          backgroundColor: 'rgba(52, 199, 89, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 3
        },
        {
          label: 'Intereses Pagados',
          data: props.interesesPagados,
          borderColor: 'rgba(255, 59, 48, 1)',
          backgroundColor: 'rgba(255, 59, 48, 0.2)',
          fill: true,
          tension: 0.4,
          borderWidth: 3
        },
        {
          label: 'Cuota Mensual',
          data: Array(props.labels.length).fill(props.cuotaMensual),
          borderColor: 'rgba(0, 122, 255, 1)',
          backgroundColor: 'rgba(0, 122, 255, 0.2)',
          fill: false,
          borderDash: [5, 5],
          tension: 0,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: 'Evolución de la Hipoteca',
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
              return `${context.dataset.label}: ${value.toLocaleString()}€`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Años',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
          },
          ticks: {
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
          },
          grid: {
            color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Euros (€)',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
          },
          ticks: {
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
            callback: function(value) {
              return value.toLocaleString() + '€';
            }
          },
          grid: {
            color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  });
};

watch(
  () => [props.labels, props.capitalPendiente, props.interesesPagados, props.cuotaMensual],
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