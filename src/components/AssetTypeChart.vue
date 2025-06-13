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

const TARGET_DISTRIBUTION = {
  'ETF': 50,
  'accion': 30,
  'cripto': 20
};

// 10% margen de error
const MARGIN = 10; 

const formatLabel = (type) => {
  switch(type) {
    case 'ETF':
      return 'ETF';
    case 'accion':
      return 'Acción';
    case 'cripto':
      return 'Cripto';
    default:
      return type;
  }
};

const chartData = computed(() => {
  // Agrupar activos por tipo y calcular el valor total para cada tipo
  const typeTotals = props.portfolio.reduce((acc, item) => {
    const type = item.asset_type;
    acc[type] = (acc[type] || 0) + parseFloat(item.total_quantity);
    return acc;
  }, {});

  // Calcular el valor total del portfolio
  const totalValue = Object.values(typeTotals).reduce((sum, value) => sum + value, 0);

  // Calcular porcentajes y preparar datos
  const labels = Object.keys(typeTotals).map(formatLabel);
  const data = Object.values(typeTotals).map(value => (value / totalValue) * 100);

  return {
    labels,
    datasets: [{
      label: 'Porcentaje por tipo de activo',
      data,
      backgroundColor: [
        '#4BC0C0', // Acciones
        '#FF9F40', // ETFs
        '#9966FF', // Cripto
      ],
      borderWidth: 1
    }]
  };
});

const diversificationStatus = computed(() => {
  const percentages = chartData.value.datasets[0].data;
  const originalLabels = Object.keys(props.portfolio.reduce((acc, item) => {
    const type = item.asset_type;
    acc[type] = (acc[type] || 0) + parseFloat(item.total_quantity);
    return acc;
  }, {}));
  
  // Comprobar si están presentes todos los tipos de activos requeridos
  const hasAllTypes = Object.keys(TARGET_DISTRIBUTION).every(type => 
    originalLabels.includes(type)
  );

  // Comprobar si los porcentajes están dentro del rango aceptable
  const isInRange = originalLabels.every((type, index) => {
    const target = TARGET_DISTRIBUTION[type];
    const actual = percentages[index];
    return Math.abs(actual - target) <= MARGIN;
  });

  if (!hasAllTypes) {
    return {
      status: 'Diversificación incompleta',
      message: 'Tu portfolio no incluye todos los tipos de activos recomendados (ETF, Acciones y Criptomonedas).',
      color: 'text-yellow-600'
    };
  } else if (!isInRange) {
    return {
      status: 'Diversificación desbalanceada',
      message: `Tu portfolio está desbalanceado. Objetivo: ETFs (50%), Acciones (30%), Cripto (20%). Considera ajustar las proporciones.`,
      color: 'text-yellow-600'
    };
  } else {
    return {
      status: 'Bien diversificado',
      message: '¡Excelente! Tu portfolio sigue la distribución recomendada: ETFs (50%), Acciones (30%), Cripto (20%).',
      color: 'text-green-600'
    };
  }
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.parsed.y.toFixed(2)}%`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function(value) {
          return value + '%';
        }
      }
    }
  }
};

onMounted(() => {
  if (chartRef.value) {
    chart = new Chart(chartRef.value, {
      type: 'bar',
      data: chartData.value,
      options: chartOptions
    });
  }
});

// Observar cambios en los datos del portfolio
watch(() => props.portfolio, () => {
  if (chart) {
    chart.data = chartData.value;
    chart.update();
  }
}, { deep: true });
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Distribución por Tipo de Activo</h2>
    
    <div class="h-80">
      <canvas ref="chartRef"></canvas>
    </div>

    <div class="mt-6 p-4 rounded-lg bg-gray-50">
      <h3 class="text-xl font-semibold mb-2" :class="diversificationStatus.color">
        {{ diversificationStatus.status }}
      </h3>
      <p class="text-gray-600">
        {{ diversificationStatus.message }}
      </p>
    </div>
  </div>
</template> 