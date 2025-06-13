<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import CompoundInterestPieChart from '../components/CompoundInterestPieChart.vue';
import CompoundInterestLineChart from '../components/CompoundInterestLineChart.vue';

const router = useRouter();
const sesion = ref(null);

onMounted(() => {
  sesion.value = sessionStorage.getItem("sesion") ? JSON.parse(sessionStorage.getItem("sesion")) : null;
  if (sesion.value && sesion.value.role === "admin") {
    router.push("/");
    return;
  }
});

const capitalInicial = ref(1000);
const aportacion = ref(100);
const frecuencia = ref("mensual");
const interes = ref(8);
const tiempo = ref(10);

const frecuenciaOpciones = [
  { label: "Mensual", value: "mensual", periodos: 12 },
  { label: "Trimestral", value: "trimestral", periodos: 4 },
  { label: "Semestral", value: "semestral", periodos: 2 },
  { label: "Anual", value: "anual", periodos: 1 },
];

const periodosPorAno = computed(() => {
  return frecuenciaOpciones.find(f => f.value === frecuencia.value)?.periodos || 12;
});

const resultado = computed(() => {
  const P = Number(capitalInicial.value);
  const A = Number(aportacion.value);
  const r = Number(interes.value) / 100 / periodosPorAno.value;
  const n = Number(tiempo.value) * periodosPorAno.value;
  const fv =
    P * Math.pow(1 + r, n) +
    (A > 0 && r > 0
      ? A * ((Math.pow(1 + r, n) - 1) / r)
      : A * n);
  return isFinite(fv) ? fv : 0;
});

const totalAportado = computed(() => {
  return Number(capitalInicial.value) + Number(aportacion.value) * periodosPorAno.value * Number(tiempo.value);
});

const interesesGanados = computed(() => {
  return resultado.value - totalAportado.value;
});

// Datos para LineChart
const labels = computed(() =>
  Array.from({ length: tiempo.value + 1 }, (_, i) => i + "")
);

const aportacionesSerie = computed(() =>
  labels.value.map(year =>
    Number(capitalInicial.value) + Number(aportacion.value) * periodosPorAno.value * Number(year)
  )
);

const totalConInteresSerie = computed(() =>
  labels.value.map(year => {
    const P = Number(capitalInicial.value);
    const A = Number(aportacion.value);
    const r = Number(interes.value) / 100 / periodosPorAno.value;
    const n = Number(year) * periodosPorAno.value;
    const fv =
      P * Math.pow(1 + r, n) +
      (A > 0 && r > 0 ? A * ((Math.pow(1 + r, n) - 1) / r) : A * n);
    return isFinite(fv) ? fv : 0;
  })
);
</script>

<template>
  <section class="container mt-15 mb-15 px-4 mx-auto">
    <h2 class="text-3xl font-medium text-gray-800 mb-6">Calculadora de Interés Compuesto</h2>
    <p class="mb-8 text-gray-700 text-xl">
      La <strong>calculadora de interés compuesto</strong> te permite estimar cómo crecerán tus ahorros o inversiones a
      lo largo del tiempo, teniendo en cuenta un capital inicial, aportaciones periódicas, el interés anual y el plazo
      en años.
      <br><br>
      Para usarla, introduce el capital inicial, la cantidad que aportarás periódicamente, la frecuencia de esas
      aportaciones, el interés anual estimado y el número de años que mantendrás la inversión. La calculadora mostrará
      el capital final estimado, el total aportado y los intereses generados.
    </p>
    <form class="bg-gray-50 rounded-lg shadow-md p-6 space-y-6 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-700 font-medium mb-2" for="capitalInicial">
            <span class="text-red-700 font-medium">*</span> Capital inicial (€)
          </label>
          <input id="capitalInicial" type="number" min="0" v-model.number="capitalInicial"
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-2" for="aportacion">
            <span class="text-red-700 font-medium">*</span> Aportación periódica (€)
          </label>
          <input id="aportacion" type="number" min="0" v-model.number="aportacion"
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-2" for="frecuencia">
            <span class="text-red-700 font-medium">*</span> Frecuencia de aportación
          </label>
          <select id="frecuencia" v-model="frecuencia"
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none">
            <option v-for="op in frecuenciaOpciones" :key="op.value" :value="op.value">{{ op.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-2" for="interes">
            <span class="text-red-700 font-medium">*</span> Interés anual (%)
          </label>
          <input id="interes" type="number" min="0" step="0.01" v-model.number="interes"
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-gray-700 font-medium mb-2" for="tiempo">
            <span class="text-red-700 font-medium">*</span> Tiempo (años)
          </label>
          <input id="tiempo" type="number" min="1" v-model.number="tiempo"
            class="w-full rounded bg-white border-gray-300 shadow-sm py-2 px-4 outline-none" />
        </div>
      </div>
    </form>
    <div class="mt-8 bg-gray-50 shadow-md rounded-lg p-6 border border-gray-200">
      <h3 class="text-2xl font-semibold text-gray-800 mb-4">Resultados</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-dark-500 text-xl">Total aportado</div>
          <div class="text-2xl font-bold text-blue-600 mt-1">{{ totalAportado.toLocaleString(undefined,
            {maximumFractionDigits: 2}) }}€</div>
        </div>
        <div>
          <div class="text-dark-500 text-xl">Intereses ganados</div>
          <div class="text-2xl font-bold text-green-600 mt-1">{{ interesesGanados.toLocaleString(undefined,
            {maximumFractionDigits: 2}) }}€</div>
        </div>
        <div>
          <div class="text-dark-500 text-xl">Capital final</div>
          <div class="text-2xl font-bold text-gray-800 mt-1">{{ resultado.toLocaleString(undefined,
            {maximumFractionDigits: 2}) }}€</div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row justify-center mt-12">
        <div class="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <CompoundInterestPieChart
        :capital-inicial="capitalInicial"
        :intereses-ganados="interesesGanados"
        :aportaciones-posteriores="totalAportado - capitalInicial"
          />
        </div>
        <div class="w-full md:w-1/2 flex justify-center">
          <CompoundInterestLineChart
        :labels="labels"
        :aportaciones="aportacionesSerie"
        :totalConInteres="totalConInteresSerie"
          />
        </div>
      </div>
    </div>
    <p class="mt-6 italic text-xl text-gray-500">
      <span class="text-red-700 font-medium">*</span> El cálculo es orientativo y no tiene en cuenta impuestos,
      comisiones ni inflación.
    </p>
  </section>
</template>
