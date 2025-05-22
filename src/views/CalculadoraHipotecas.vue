<script setup>
import { ref, computed } from "vue";
import MortgagePieChart from '../components/MortgagePieChart.vue';
import MortgageLineChart from '../components/MortgageLineChart.vue';

const precioVivienda = ref(300000);
const entrada = ref(20);
const plazo = ref(30);
const tipoInteres = ref(3.5);
const tipoHipoteca = ref("fijo");
const euribor = ref(3.5);

const tiposHipoteca = [
  { label: "Hipoteca Fija", value: "fijo" },
  { label: "Hipoteca Variable", value: "variable" },
  { label: "Hipoteca Mixta", value: "mixto" }
];

// Cálculo del capital prestado
const capitalPrestado = computed(() => {
  return precioVivienda.value * (1 - entrada.value / 100);
});

// Cálculo de la cuota mensual
const cuotaMensual = computed(() => {
  const P = capitalPrestado.value;
  const r = tipoInteres.value / 100 / 12;
  const n = plazo.value * 12;
  
  if (r === 0) return P / n;
  
  const cuota = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return isFinite(cuota) ? cuota : 0;
});

// Cálculo del total a pagar
const totalAPagar = computed(() => {
  return cuotaMensual.value * plazo.value * 12;
});

// Cálculo de los intereses totales
const interesesTotales = computed(() => {
  return totalAPagar.value - capitalPrestado.value;
});

// Datos para el gráfico de líneas
const labels = computed(() =>
  Array.from({ length: plazo.value + 1 }, (_, i) => i + "")
);

const capitalPendienteSerie = computed(() =>
  labels.value.map(year => {
    const P = capitalPrestado.value;
    const r = tipoInteres.value / 100 / 12;
    const n = year * 12;
    const cuota = cuotaMensual.value;
    
    if (r === 0) return P - (cuota * n);
    
    const capitalPendiente = P * Math.pow(1 + r, n) - cuota * ((Math.pow(1 + r, n) - 1) / r);
    return Math.max(0, isFinite(capitalPendiente) ? capitalPendiente : 0);
  })
);

const interesesPagadosSerie = computed(() =>
  labels.value.map(year => {
    const P = capitalPrestado.value;
    const r = tipoInteres.value / 100 / 12;
    const n = year * 12;
    const cuota = cuotaMensual.value;
    
    if (r === 0) return 0;
    
    const capitalPendiente = P * Math.pow(1 + r, n) - cuota * ((Math.pow(1 + r, n) - 1) / r);
    const interesesPagados = (cuota * n) - (P - Math.max(0, capitalPendiente));
    return Math.max(0, isFinite(interesesPagados) ? interesesPagados : 0);
  })
);

// Validaciones
const validaciones = computed(() => {
  const errores = [];
  
  if (precioVivienda.value <= 0) {
    errores.push("El precio de la vivienda debe ser mayor que 0");
  }
  
  if (entrada.value < 20) {
    errores.push("La entrada mínima debe ser del 20%");
  }
  
  if (entrada.value > 100) {
    errores.push("La entrada no puede ser mayor al 100%");
  }
  
  if (plazo.value < 5 || plazo.value > 40) {
    errores.push("El plazo debe estar entre 5 y 40 años");
  }
  
  if (tipoInteres.value < 0) {
    errores.push("El tipo de interés no puede ser negativo");
  }
  
  return errores;
});
</script>

<template>
  <section class="container mt-15 mb-15 px-4 mx-auto">
    <h2 class="text-3xl font-medium text-gray-800 dark:text-white mb-6">Calculadora de Hipotecas</h2>
    <p class="mb-8 text-gray-700 text-xl dark:text-gray-300">
      La <strong>calculadora de hipotecas</strong> te permite estimar las cuotas mensuales y el coste total de tu hipoteca, teniendo en cuenta el precio de la vivienda, la entrada, el plazo y el tipo de interés.
      <br><br>
      Para usarla, introduce el precio de la vivienda, el porcentaje de entrada (mínimo 20%), el plazo en años, el tipo de interés y el tipo de hipoteca que prefieres. La calculadora mostrará la cuota mensual, el total a pagar y los intereses generados.
    </p>
    
    <form class="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 space-y-6 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2" for="precioVivienda">
            <span class="text-red-700 font-medium">*</span> Precio de la vivienda (€)
          </label>
          <input 
            id="precioVivienda" 
            type="number" 
            min="0" 
            v-model.number="precioVivienda" 
            class="w-full rounded bg-white border-gray-300 dark:bg-gray-800 dark:text-white shadow-sm py-2 px-4 outline-none" 
          />
        </div>
        
        <div>
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2" for="entrada">
            <span class="text-red-700 font-medium">*</span> Entrada (%)
          </label>
          <input 
            id="entrada" 
            type="number" 
            min="20" 
            max="100" 
            v-model.number="entrada" 
            class="w-full rounded bg-white border-gray-300 dark:bg-gray-800 dark:text-white shadow-sm py-2 px-4 outline-none" 
          />
        </div>
        
        <div>
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2" for="tipoHipoteca">
            <span class="text-red-700 font-medium">*</span> Tipo de Hipoteca
          </label>
          <select 
            id="tipoHipoteca" 
            v-model="tipoHipoteca" 
            class="w-full rounded bg-white border-gray-300 dark:bg-gray-800 dark:text-white shadow-sm py-2 px-4 outline-none"
          >
            <option v-for="tipo in tiposHipoteca" :key="tipo.value" :value="tipo.value">
              {{ tipo.label }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2" for="tipoInteres">
            <span class="text-red-700 font-medium">*</span> Tipo de interés (%)
          </label>
          <input 
            id="tipoInteres" 
            type="number" 
            min="0" 
            step="0.01" 
            v-model.number="tipoInteres" 
            class="w-full rounded bg-white border-gray-300 dark:bg-gray-800 dark:text-white shadow-sm py-2 px-4 outline-none" 
          />
        </div>
        
        <div v-if="tipoHipoteca === 'variable'" class="md:col-span-2">
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2" for="euribor">
            <span class="text-red-700 font-medium">*</span> Euribor (%)
          </label>
          <input 
            id="euribor" 
            type="number" 
            min="0" 
            step="0.01" 
            v-model.number="euribor" 
            class="w-full rounded bg-white border-gray-300 dark:bg-gray-800 dark:text-white shadow-sm py-2 px-4 outline-none" 
          />
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2" for="plazo">
            <span class="text-red-700 font-medium">*</span> Plazo (años)
          </label>
          <input 
            id="plazo" 
            type="number" 
            min="5" 
            max="40" 
            v-model.number="plazo" 
            class="w-full rounded bg-white border-gray-300 dark:bg-gray-800 dark:text-white shadow-sm py-2 px-4 outline-none" 
          />
        </div>
      </div>
      
      <div v-if="validaciones.length > 0" class="mt-4">
        <div v-for="error in validaciones" :key="error" class="text-red-500 text-sm">
          {{ error }}
        </div>
      </div>
    </form>

    <div class="mt-8 bg-gray-50 dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Resultados</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-dark-500 dark:text-gray-400 text-xl">Cuota mensual</div>
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {{ cuotaMensual.toLocaleString(undefined, {maximumFractionDigits: 2}) }}€
          </div>
        </div>
        <div>
          <div class="text-dark-500 dark:text-gray-400 text-xl">Intereses totales</div>
          <div class="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {{ interesesTotales.toLocaleString(undefined, {maximumFractionDigits: 2}) }}€
          </div>
        </div>
        <div>
          <div class="text-dark-500 dark:text-gray-400 text-xl">Total a pagar</div>
          <div class="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {{ totalAPagar.toLocaleString(undefined, {maximumFractionDigits: 2}) }}€
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-12">
        <div class="w-1/2 flex justify-center">
          <MortgagePieChart
            :capital-prestado="capitalPrestado"
            :intereses-totales="interesesTotales"
            :entrada="precioVivienda * (entrada / 100)"
          />
        </div>
        <div class="w-1/2 flex justify-center">
          <MortgageLineChart
            :labels="labels"
            :capital-pendiente="capitalPendienteSerie"
            :intereses-pagados="interesesPagadosSerie"
            :cuota-mensual="cuotaMensual"
          />
        </div>
      </div>
    </div>

    <p class="mt-6 italic text-xl text-gray-500 dark:text-gray-400">
      <span class="text-red-700 font-medium">*</span> El cálculo es orientativo y no tiene en cuenta otros gastos como comisiones, seguros, impuestos o notaría.
    </p>
  </section>
</template>