<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import TradingViewWidget from "@/components/TradingViewWidget.vue";
import axios from "axios";

const route = useRoute();
const asset = ref(null);
const error = ref("");
const sesion = ref(null);
const tieneActivo = ref(false);
const total_quantity = ref(0);

const showAddModal = ref(false);
const showSubtractModal = ref(false);
const cantidad = ref(1);
const addError = ref("");
const subtractError = ref("");

function anadirAPortafolio() {
  cantidad.value = 1;
  addError.value = "";
  showAddModal.value = true;
}
function sustraerDePortafolio() {
  cantidad.value = 1;
  subtractError.value = "";
  showSubtractModal.value = true;
}

async function confirmarAnadir() {
  addError.value = "";
  if (!cantidad.value || cantidad.value <= 0.01) {
    addError.value = "Introduce una cantidad mayor que 0,01€.";
    return;
  }
  try {
    await axios.post("http://localhost:3000/transactions/", {
      user_id: sesion.value.id,
      asset_id: asset.value.id,
      transaction_type: "compra",
      quantity: cantidad.value,
    });
    showAddModal.value = false;
    await actualizarTieneActivo();
  } catch (e) {
    addError.value = e.response?.data?.message || "Error de red al añadir al portafolio.";
  }
}

async function confirmarSustraer() {
  subtractError.value = "";
  if (!cantidad.value || cantidad.value <= 0.01 || cantidad.value > total_quantity.value) {
    if (cantidad.value > total_quantity.value) {
      subtractError.value = "No puedes sustraer más de lo que tienes.";
    } else if (cantidad.value <= 0) {
      subtractError.value = "Introduce una cantidad mayor que 0,01€.";
    }
    return;
  }
  try {
    await axios.post("http://localhost:3000/transactions", {
      user_id: sesion.value.id,
      asset_id: asset.value.id,
      transaction_type: "venta",
      quantity: cantidad.value,
    });
    showSubtractModal.value = false;
    await actualizarTieneActivo();
  } catch (e) {
    subtractError.value = e.response?.data?.message || "Error de red al sustraer del portafolio.";
  }
}

// Obtiene la suma de quantity del usuario para este activo
async function actualizarTieneActivo() {
  if (sesion.value && asset.value) {
    try {
      const response = await axios.get(`http://localhost:3000/transactions/user/${sesion.value.id}/asset/${asset.value.id}/quantity`);
      tieneActivo.value = response.data.total_quantity > 0;
      total_quantity.value = response.data.total_quantity;
    } catch (e) {
      tieneActivo.value = false;
      console.error("Error al obtener la cantidad del activo:", e);
    }
  }
}

onMounted(async () => {
  sesion.value = localStorage.getItem("sesion") ? JSON.parse(localStorage.getItem("sesion")) : null;
  try {
    const symbol = route.params.ticker;
    const response = await axios.get("http://localhost:3000/assets");
    asset.value = response.data.find(a => a.trading_view_symbol === symbol);
    if (!asset.value) throw new Error("Activo no encontrado.");

    // Si el usuario está logueado, comprobamos si tiene el activo en su portafolio
    await actualizarTieneActivo();
  } catch (e) {
    error.value = e.response?.data?.message || e.message;
  }
});
</script>

<template>
  <section class="container mt-25 mb-15 px-4 mx-auto">
    <div v-if="error" class="text-red-500 text-xl text-center py-10">{{ error }}</div>
    <div v-else-if="asset" class="flex flex-col md:flex-row gap-10 items-start">
      <!-- Columna izquierda: info del activo -->
      <div class="w-full md:w-6/20 flex flex-col items-start">
        <div class="flex items-center mt-5 mb-6">
          <img :src="asset.logo_url" :alt="asset.name"
            class="w-28 h-28 rounded-full object-cover border border-gray-300 mr-6" />
          <h1 class="text-4xl font-semibold text-gray-800 dark:text-white">{{ asset.name }}</h1>
        </div>
        <!-- Etiquetas debajo del título -->
        <div class="flex gap-2 mt-2 mb-4 w-full">
          <span
            class="inline-block px-4 py-1.5 rounded bg-blue-600 text-white text-lg font-medium shadow text-center w-21">
            {{ asset.asset_type.charAt(0).toUpperCase() + asset.asset_type.slice(1) }}
          </span>
          <span
            class="inline-block px-4 py-2 rounded font-bold bg-gray-200 text-gray-800 text-s font-medium shadow text-center w-14/20">
            {{ asset.trading_view_symbol }}
          </span>
        </div>
        <p class="mt-4 text-lg text-gray-700 dark:text-gray-300">{{ asset.description }}</p>
        <div class="mt-8 w-full">
          <template v-if="!sesion">
            <router-link to="/login"
              class="w-19/20 bg-blue-600 hover:bg-blue-500 text-white text-center mt-2.5 py-3.5 rounded-md mt-auto font-semibold shadow block">
              Loguéate para gestionar tu portafolio
            </router-link>
          </template>
          <template v-else>
            <div v-if="tieneActivo" class="flex gap-4">
              <button @click="anadirAPortafolio"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow transition">
                Añadir a portafolio
              </button>
              <button @click="sustraerDePortafolio"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow transition">
                Sustraer de mi portafolio
              </button>
            </div>
            <div v-else>
              <button @click="anadirAPortafolio"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow transition">
                Añadir a portafolio
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

    <!-- Modal Añadir -->
    <div v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 transition-opacity">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Añadir a portafolio</h2>
        <label class="block mb-2 text-xl font-semibold text-gray-700">Cantidad actual: {{ total_quantity }}€</label>
        <input v-model.number="cantidad" type="number" min="1" placeholder="Cantidad a añadir en €"
          class="w-full border border-gray-300 rounded-md text-lg px-4 py-2 mb-4" />
        <div v-if="addError" class="text-red-600 text-m mb-2">{{ addError }}</div>
        <div class="flex justify-end space-x-4">
          <button @click="showAddModal = false"
            class="w-1/2 px-4 py-2 text-gray-900 font-bold text-lg rounded-md hover:bg-gray-300">
            Cancelar
          </button>
          <button @click="confirmarAnadir"
            class="w-1/2 px-4 py-2 bg-blue-600 text-white text-xl rounded-md hover:bg-blue-700">
            Añadir
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Sustraer -->
    <div v-if="showSubtractModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 transition-opacity">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Sustraer de portafolio</h2>
        <label class="block mb-2 text-xl font-semibold text-gray-700">Cantidad actual: {{ total_quantity }}€</label>
        <input v-model.number="cantidad" type="number" min="1" placeholder="Cantidad a añadir en €"
          class="w-full border border-gray-300 rounded-md text-lg px-4 py-2 mb-4" />
        <div v-if="subtractError" class="text-red-600 text-m mb-2">{{ subtractError }}</div>
        <div class="flex justify-end space-x-4">
          <button @click="showSubtractModal = false"
            class="w-1/2 px-4 py-2 text-gray-900 font-bold text-lg rounded-md hover:bg-gray-300">
            Cancelar
          </button>
          <button @click="confirmarSustraer"
            class="w-1/2 px-4 py-2 bg-red-600 text-white text-xl rounded-md hover:bg-red-700">
            Sustraer
          </button>
        </div>
      </div>
    </div>
  </section>
</template>