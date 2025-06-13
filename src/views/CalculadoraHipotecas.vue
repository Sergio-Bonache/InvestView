<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import MortgagePieChart from '../components/MortgagePieChart.vue';
import MortgageLineChart from '../components/MortgageLineChart.vue';

const router = useRouter();
const sesion = ref(null);

onMounted(() => {
  sesion.value = sessionStorage.getItem("sesion") ? JSON.parse(sessionStorage.getItem("sesion")) : null;
  if (sesion.value && sesion.value.role === "admin") {
    router.push("/");
    return;
  }
});

const precioVivienda = ref(300000);
const entrada = ref(20);
const plazo = ref(30);
const tipoInteres = ref(3.5);
const tipoHipoteca = ref("fijo");
const euribor = ref(3.5);
const diferencial = ref(1.0);
const periodoFijo = ref(5); // Años de tipo fijo para hipoteca mixta

const tiposHipoteca = [
  { label: "Hipoteca Fija", value: "fijo" },
  { label: "Hipoteca Variable", value: "variable" },
  { label: "Hipoteca Mixta", value: "mixto" }
];

// Cálculo del capital prestado
const capitalPrestado = computed(() => {
  return precioVivienda.value * (1 - entrada.value / 100);
});

// Cálculo del tipo de interés efectivo según el tipo de hipoteca
const tipoInteresEfectivo = computed(() => {
  if (tipoHipoteca.value === "fijo") {
    return tipoInteres.value;
  } else if (tipoHipoteca.value === "variable") {
    return euribor.value + diferencial.value;
  } else if (tipoHipoteca.value === "mixto") {
    // Para hipoteca mixta, usamos el tipo fijo durante el período fijo
    return tipoInteres.value;
  }
  return tipoInteres.value;
});

// Cálculo de la cuota mensual
const cuotaMensual = computed(() => {
  if (tipoHipoteca.value === "mixto") {
    const P = capitalPrestado.value;
    const rFijo = tipoInteres.value / 100 / 12;
    const rVariable = (euribor.value + diferencial.value) / 100 / 12;
    const nTotal = plazo.value * 12;
    const nFijo = periodoFijo.value * 12;
    
    // Calculamos la cuota constante para todo el préstamo usando el tipo fijo
    const cuotaFija = P * (rFijo * Math.pow(1 + rFijo, nTotal)) / (Math.pow(1 + rFijo, nTotal) - 1);
    
    // Calculamos el capital pendiente después del período fijo
    const capitalPendiente = P * Math.pow(1 + rFijo, nFijo) - cuotaFija * ((Math.pow(1 + rFijo, nFijo) - 1) / rFijo);
    
    // Calculamos la nueva cuota para el período variable
    const nVariable = nTotal - nFijo;
    const cuotaVariable = capitalPendiente * (rVariable * Math.pow(1 + rVariable, nVariable)) / (Math.pow(1 + rVariable, nVariable) - 1);
    
    return {
      cuotaFija,
      cuotaVariable,
      capitalPendiente
    };
  }
  
  const P = capitalPrestado.value;
  const r = tipoInteresEfectivo.value / 100 / 12;
  const n = plazo.value * 12;
  
  if (r === 0) return P / n;
  
  const cuota = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return isFinite(cuota) ? cuota : 0;
});

// Cálculo del total a pagar
const totalAPagar = computed(() => {
  if (tipoHipoteca.value === "mixto") {
    const cuotas = cuotaMensual.value;
    const nFijo = periodoFijo.value * 12;
    const nVariable = (plazo.value - periodoFijo.value) * 12;
    return (cuotas.cuotaFija * nFijo) + (cuotas.cuotaVariable * nVariable);
  }
  
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
    if (tipoHipoteca.value === "mixto") {
      const P = capitalPrestado.value;
      const rFijo = tipoInteres.value / 100 / 12;
      const rVariable = (euribor.value + diferencial.value) / 100 / 12;
      const nTotal = plazo.value * 12;
      const nFijo = periodoFijo.value * 12;
      const n = year * 12;
      
      // Calculamos la cuota constante para todo el préstamo
      const cuotaFija = P * (rFijo * Math.pow(1 + rFijo, nTotal)) / (Math.pow(1 + rFijo, nTotal) - 1);
      
      if (n <= nFijo) {
        // Período fijo
        return P * Math.pow(1 + rFijo, n) - cuotaFija * ((Math.pow(1 + rFijo, n) - 1) / rFijo);
      } else {
        // Período variable
        const capitalPendiente = P * Math.pow(1 + rFijo, nFijo) - cuotaFija * ((Math.pow(1 + rFijo, nFijo) - 1) / rFijo);
        const nVariable = nTotal - nFijo;
        const cuotaVariable = capitalPendiente * (rVariable * Math.pow(1 + rVariable, nVariable)) / (Math.pow(1 + rVariable, nVariable) - 1);
        const nRestante = n - nFijo;
        return capitalPendiente * Math.pow(1 + rVariable, nRestante) - cuotaVariable * ((Math.pow(1 + rVariable, nRestante) - 1) / rVariable);
      }
    }
    
    const P = capitalPrestado.value;
    const r = tipoInteresEfectivo.value / 100 / 12;
    const n = year * 12;
    const cuota = cuotaMensual.value;
    
    if (r === 0) return P - (cuota * n);
    
    const capitalPendiente = P * Math.pow(1 + r, n) - cuota * ((Math.pow(1 + r, n) - 1) / r);
    return Math.max(0, isFinite(capitalPendiente) ? capitalPendiente : 0);
  })
);

const interesesPagadosSerie = computed(() =>
  labels.value.map(year => {
    if (tipoHipoteca.value === "mixto") {
      const P = capitalPrestado.value;
      const rFijo = tipoInteres.value / 100 / 12;
      const rVariable = (euribor.value + diferencial.value) / 100 / 12;
      const nTotal = plazo.value * 12;
      const nFijo = periodoFijo.value * 12;
      const n = year * 12;
      
      // Calculamos la cuota constante para todo el préstamo
      const cuotaFija = P * (rFijo * Math.pow(1 + rFijo, nTotal)) / (Math.pow(1 + rFijo, nTotal) - 1);
      
      if (n <= nFijo) {
        // Período fijo
        const capitalPendiente = P * Math.pow(1 + rFijo, n) - cuotaFija * ((Math.pow(1 + rFijo, n) - 1) / rFijo);
        return (cuotaFija * n) - (P - capitalPendiente);
      } else {
        // Período variable
        const capitalPendiente = P * Math.pow(1 + rFijo, nFijo) - cuotaFija * ((Math.pow(1 + rFijo, nFijo) - 1) / rFijo);
        const nVariable = nTotal - nFijo;
        const cuotaVariable = capitalPendiente * (rVariable * Math.pow(1 + rVariable, nVariable)) / (Math.pow(1 + rVariable, nVariable) - 1);
        const nRestante = n - nFijo;
        const capitalPendienteFinal = capitalPendiente * Math.pow(1 + rVariable, nRestante) - cuotaVariable * ((Math.pow(1 + rVariable, nRestante) - 1) / rVariable);
        return (cuotaFija * nFijo + cuotaVariable * nRestante) - (P - capitalPendienteFinal);
      }
    }
    
    const P = capitalPrestado.value;
    const r = tipoInteresEfectivo.value / 100 / 12;
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
    <h2 class="text-3xl font-medium text-gray-800 mb-6">Calculadora de Hipotecas</h2>
    <p class="mb-8 text-gray-700 text-xl">
      La <strong>calculadora de hipotecas</strong> te permite estimar las cuotas mensuales y el coste total de tu hipoteca, teniendo en cuenta el precio de la vivienda, la entrada, el plazo y el tipo de interés.
      <br><br>
      Para usarla, introduce el precio de la vivienda, el porcentaje de entrada (mínimo 20%), el plazo en años, el tipo de interés y el tipo de hipoteca que prefieres. La calculadora mostrará la cuota mensual, el total a pagar y los intereses generados.
    </p>
    
    <form class="bg-gray-50 rounded-lg shadow-md p-6 space-y-6 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-700 font-medium mb-2" for="precioVivienda">
            <span class="text-red-700 font-medium">*</span> Precio de la vivienda (€)
          </label>
          <input 
            id="precioVivienda" 
            type="number" 
            min="0" 
            v-model.number="precioVivienda" 
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" 
          />
        </div>
        
        <div>
          <label class="block text-gray-700 font-medium mb-2" for="entrada">
            <span class="text-red-700 font-medium">*</span> Entrada (%)
          </label>
          <input 
            id="entrada" 
            type="number" 
            min="20" 
            max="100" 
            v-model.number="entrada" 
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" 
          />
        </div>
        
        <div>
          <label class="block text-gray-700 font-medium mb-2" for="tipoHipoteca">
            <span class="text-red-700 font-medium">*</span> Tipo de Hipoteca
          </label>
          <select 
            id="tipoHipoteca" 
            v-model="tipoHipoteca" 
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none"
          >
            <option v-for="tipo in tiposHipoteca" :key="tipo.value" :value="tipo.value">
              {{ tipo.label }}
            </option>
          </select>
        </div>
        
        <div v-if="tipoHipoteca === 'fijo'">
          <label class="block text-gray-700 font-medium mb-2" for="tipoInteres">
            <span class="text-red-700 font-medium">*</span> Tipo de interés fijo (%)
          </label>
          <input 
            id="tipoInteres" 
            type="number" 
            min="0" 
            step="0.01" 
            v-model.number="tipoInteres" 
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" 
          />
        </div>
        
        <div v-if="tipoHipoteca === 'variable' || tipoHipoteca === 'mixto'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2" for="euribor">
              <span class="text-red-700 font-medium">*</span> Euribor (%)
            </label>
            <input 
              id="euribor" 
              type="number" 
              min="0" 
              step="0.01" 
              v-model.number="euribor" 
              class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" 
            />
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2" for="diferencial">
              <span class="text-red-700 font-medium">*</span> Diferencial (%)
            </label>
            <input 
              id="diferencial" 
              type="number" 
              min="0" 
              step="0.01" 
              v-model.number="diferencial" 
              class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" 
            />
          </div>
        </div>
        
        <div v-if="tipoHipoteca === 'mixto'" class="md:col-span-2">
          <label class="block text-gray-700 font-medium mb-2" for="periodoFijo">
            <span class="text-red-700 font-medium">*</span> Período de tipo fijo (años)
          </label>
          <input 
            id="periodoFijo" 
            type="number" 
            min="1" 
            :max="plazo - 1" 
            v-model.number="periodoFijo" 
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" 
          />
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-gray-700 font-medium mb-2" for="plazo">
            <span class="text-red-700 font-medium">*</span> Plazo (años)
          </label>
          <input 
            id="plazo" 
            type="number" 
            min="5" 
            max="40" 
            v-model.number="plazo" 
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" 
          />
        </div>
      </div>
      
      <div v-if="validaciones.length > 0" class="mt-4">
        <div v-for="error in validaciones" :key="error" class="text-red-500 text-sm">
          {{ error }}
        </div>
      </div>
    </form>

    <div class="mt-8 bg-gray-50 shadow-md rounded-lg p-6 border border-gray-200">
      <h3 class="text-2xl font-semibold text-gray-800 mb-4">Resultados</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-dark-500 text-xl">Cuota mensual</div>
          <template v-if="tipoHipoteca === 'mixto'">
            <div class="text-2xl font-bold text-blue-600 mt-1">
              {{ cuotaMensual.cuotaFija.toLocaleString(undefined, {maximumFractionDigits: 2}) }}€
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Período fijo ({{ periodoFijo }} años)
            </div>
            <div class="text-2xl font-bold text-blue-600 mt-2">
              {{ cuotaMensual.cuotaVariable.toLocaleString(undefined, {maximumFractionDigits: 2}) }}€
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Período variable ({{ plazo - periodoFijo }} años)
            </div>
          </template>
          <template v-else>
            <div class="text-2xl font-bold text-blue-600 mt-1">
              {{ cuotaMensual.toLocaleString(undefined, {maximumFractionDigits: 2}) }}€
            </div>
          </template>
        </div>
        <div>
          <div class="text-dark-500 text-xl">Intereses totales</div>
          <div class="text-2xl font-bold text-red-600 mt-1">
            {{ interesesTotales.toLocaleString(undefined, {maximumFractionDigits: 2}) }}€
          </div>
        </div>
        <div>
          <div class="text-dark-500 text-xl">Total a pagar</div>
          <div class="text-2xl font-bold text-gray-800 mt-1">
            {{ totalAPagar.toLocaleString(undefined, {maximumFractionDigits: 2}) }}€
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row justify-center mt-12 gap-8">
        <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <MortgagePieChart
        :capital-prestado="capitalPrestado"
        :intereses-totales="interesesTotales"
        :entrada="precioVivienda * (entrada / 100)"
          />
        </div>
        <div class="w-full md:w-1/2 flex justify-center">
          <MortgageLineChart
        :labels="labels"
        :capital-pendiente="capitalPendienteSerie"
        :intereses-pagados="interesesPagadosSerie"
        :cuota-mensual="cuotaMensual"
          />
        </div>
      </div>
    </div>

    <p class="mt-6 italic text-xl text-gray-500">
      <span class="text-red-700 font-medium">*</span> El cálculo es orientativo y no tiene en cuenta otros gastos como comisiones, seguros, impuestos o notaría.
    </p>
  </section>
</template>