<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import TradingViewWidget from "@/components/TradingViewWidget.vue";

const route = useRoute();
const router = useRouter();
const asset = ref(null);
const error = ref("");
const sesion = ref(null);

onMounted(async () => {
  sesion.value = localStorage.getItem("sesion") ? JSON.parse(localStorage.getItem("sesion")) : null;
  try {
    const symbol = route.params.ticker;
    const response = await fetch(`http://localhost:3000/assets`);
    if (!response.ok) throw new Error("No se pudo obtener el activo.");
    const activos = await response.json();
    asset.value = activos.find(a => a.trading_view_symbol === symbol);
    if (!asset.value) throw new Error("Activo no encontrado.");
  } catch (e) {
    error.value = e.message;
  }
});

// Funciones placeholder para añadir/sustraer del portafolio
function añadirAPortafolio() {
  // Aquí tu lógica para añadir
  alert("Añadido a tu portafolio");
}
function sustraerDePortafolio() {
  // Aquí tu lógica para sustraer
  alert("Sustraído de tu portafolio");
}
</script>

<template>
  <section class="container mt-25 mb-15 px-4 mx-auto">
    <div v-if="error" class="text-red-500 text-xl text-center py-10">{{ error }}</div>
    <div v-else-if="asset" class="flex flex-col md:flex-row gap-10 items-start">
      <!-- Columna izquierda: info del activo -->
      <div class="w-full md:w-6/20 flex flex-col items-start">
        <div class="flex items-center mt-5 mb-6">
          <img :src="asset.logo_url" :alt="asset.name" class="w-28 h-28 rounded-full object-cover border border-gray-300 mr-6" />
          <h1 class="text-5xl font-semibold text-gray-800 dark:text-white">{{ asset.name }}</h1>
        </div>
        <!-- Etiquetas debajo del título -->
        <div class="flex gap-2 mt-2 mb-4 w-full">
          <span class="inline-block px-4 py-1.5 rounded bg-blue-600 text-white text-lg font-medium shadow text-center w-3.5/10">
            {{ asset.asset_type.charAt(0).toUpperCase() + asset.asset_type.slice(1) }}
          </span>
          <span class="inline-block px-4 py-2 rounded font-bold bg-gray-200 text-gray-800 text-s font-medium shadow text-center w-7/10">
             {{ asset.trading_view_symbol }}
          </span>
        </div>
        <p class="mt-4 text-lg text-gray-700 dark:text-gray-300">{{ asset.description }}</p>
        <div class="mt-8 w-full">
          <template v-if="!sesion">
            <div class="w-full bg-yellow-100 text-yellow-800 text-center py-3 rounded-md font-semibold shadow">
              Loguéate para gestionar tu portafolio
            </div>
          </template>
          <template v-else>
            <div class="flex gap-4">
              <button
                @click="añadirAPortafolio"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow transition"
              >
                Añadir a portafolio
              </button>
              <button
                @click="sustraerDePortafolio"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow transition"
              >
                Sustraer de mi portafolio
              </button>
            </div>
          </template>
        </div>
      </div>
      <!-- Columna derecha: gráfico -->
      <div class="w-full md:w-18/20 flex flex-col items-center">
        <div class="w-full h-[400px]">
          <TradingViewWidget :symbol="asset.trading_view_symbol" />
        </div>
      </div>
    </div>
    <div v-else class="text-gray-500 text-center py-10">Cargando activo...</div>
  </section>
</template>