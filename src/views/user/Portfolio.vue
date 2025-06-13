<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import PortfolioChart from '../../components/PortfolioChart.vue';
import AssetTypeChart from '../../components/AssetTypeChart.vue';

const router = useRouter();
const sesion = ref(null);
const portfolio = ref([]);
const error = ref("");
const itemsPerPage = 5;
const currentPage = ref(1);
const searchText = ref("");

// Estados de los modales
const showAddModal = ref(false);
const showSubtractModal = ref(false);
const cantidad = ref(1);
const addError = ref("");
const subtractError = ref("");
const selectedAsset = ref(null);

// Propiedad computada para los elementos paginados del portfolio
const paginatedPortfolio = computed(() => {
  let filtrados = portfolio.value;
  if (searchText.value.trim()) {
    filtrados = portfolio.value.filter(item =>
      item.name.toLowerCase().includes(searchText.value.trim().toLowerCase())
    );
  }
  const start = 0;
  const end = currentPage.value * itemsPerPage;
  return filtrados.slice(start, end);
});

// Propiedad computada para comprobar si hay más elementos para mostrar
const hasMoreItems = computed(() => {
  let filtrados = portfolio.value;
  if (searchText.value.trim()) {
    filtrados = portfolio.value.filter(item =>
      item.name.toLowerCase().includes(searchText.value.trim().toLowerCase())
    );
  }
  return currentPage.value * itemsPerPage < filtrados.length;
});

function loadMore() {
  currentPage.value++;
}

async function getAssetIdByName(assetName) {
  try {
    const response = await axios.get("https://investviewback.onrender.com/assets");
    const asset = response.data.find(a => a.name === assetName);
    if (!asset) throw new Error("Activo no encontrado.");
    return asset.id;
  } catch (e) {
    console.error("Error al obtener el ID del activo:", e);
    throw e;
  }
}

onMounted(async () => {
  sesion.value = sessionStorage.getItem("sesion") ? JSON.parse(sessionStorage.getItem("sesion")) : null;
  if (!sesion.value || sesion.value.role !== "client") {
    router.push("/login");
    return;
  }
  try {
    const response = await axios.get(`https://investviewback.onrender.com/transactions/portfolio/${sesion.value.id}`);
    portfolio.value = response.data;
  } catch (e) {
    error.value = e.message;
  }
});

function anadir(activo) {
  selectedAsset.value = activo;
  cantidad.value = 1;
  addError.value = "";
  showAddModal.value = true;
}

function sustraer(activo) {
  selectedAsset.value = activo;
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
    const assetId = await getAssetIdByName(selectedAsset.value.name);
    const response = await axios.post("https://investviewback.onrender.com/transactions/", {
      user_id: sesion.value.id,
      asset_id: assetId,
      transaction_type: "compra",
      quantity: cantidad.value,
    });
    
    showAddModal.value = false;
    const response2 = await axios.get(`https://investviewback.onrender.com/transactions/portfolio/${sesion.value.id}`);
    portfolio.value = response2.data;
  } catch (e) {
    addError.value = e.response?.data?.message || "Error de red al añadir al portfolio.";
  }
}

async function confirmarSustraer() {
  subtractError.value = "";
  if (!cantidad.value || cantidad.value <= 0.01 || cantidad.value > selectedAsset.value.total_quantity) {
    if (cantidad.value > selectedAsset.value.total_quantity) {
      subtractError.value = "No puedes sustraer más de lo que tienes.";
    } else if (cantidad.value <= 0) {
      subtractError.value = "Introduce una cantidad mayor que 0,01€.";
    }
    return;
  }
  try {
    const assetId = await getAssetIdByName(selectedAsset.value.name);
    const response = await axios.post("https://investviewback.onrender.com/transactions", {
      user_id: sesion.value.id,
      asset_id: assetId,
      transaction_type: "venta",
      quantity: cantidad.value,
    });
    
    showSubtractModal.value = false;
    const response2 = await axios.get(`https://investviewback.onrender.com/transactions/portfolio/${sesion.value.id}`);
    portfolio.value = response2.data;
  } catch (e) {
    subtractError.value = e.response?.data?.message || "Error de red al sustraer del portfolio.";
  }
}
</script>

<template>
  <div class="flex flex-col mt-20 mb-20 w-11/12 mx-auto">
    <!-- Empty Portfolio Card -->
    <div v-if="portfolio.length === 0" class="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg border border-gray-200 my-20 w-2/3 mx-auto">
      <div class="w-24 h-24 mb-6 text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Tu portfolio está vacío</h2>
      <p class="text-lg text-gray-600 mb-8 text-center">
        Comienza a construir tu portfolio de inversión añadiendo activos disponibles.
      </p>
      <RouterLink to="/assets" class="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
        Explorar Activos
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 ml-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </RouterLink>
    </div>

    <!-- Portfolio -->
    <div v-else class="space-y-8">
      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-100">
        <div class="bg-gray-100 rounded-lg p-6">
          <PortfolioChart :portfolio="portfolio" />
        </div>
        <div class="bg-gray-100 rounded-lg p-6">
          <AssetTypeChart :portfolio="portfolio" />
        </div>
      </div>

      <!-- Tabla de Portfolio -->
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col"
                class="w-1/3 py-3.5 px-4 text-xl font-semibold text-left rtl:text-right text-gray-700">
                <div class="flex items-center gap-x-3">
                  <span>Nombre</span>
                </div>
              </th>

              <th scope="col"
                class="w-1/3 px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-700">
                Cantidad
              </th>
              <th scope="col"
                class="w-1/3 px-4 py-3.5 text-xl font-semibold text-left rtl:text-right text-gray-700">
                <div class="flex items-center justify-between">
                  <div class="w-full">
                    <label for="search" class="inline-flex items-center gap-x-2 w-full">
                      <span class="text-sm font-medium text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="size-6.5">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                      </span>
                      <div class="relative w-full">
                        <input type="text" id="search" placeholder="Buscar Activo"
                          class="mt-0.5 w-full rounded border-gray-300 shadow-lg shadow-gray-300/60 ring-1 ring-gray-200 sm:text-base py-2 outline-none pl-4 placeholder:italic placeholder:pl-0.5"
                          v-model="searchText" />
                      </div>
                    </label>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in paginatedPortfolio" :key="item.asset_id" class="hover:bg-gray-50">
              <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div class="inline-flex items-center gap-x-3">
                  <div class="flex items-center gap-x-2">
                    <RouterLink :to="`/assets/${item.trading_view_symbol}`" class="flex items-center gap-3 hover:opacity-80">
                      <img :src="item.logo_url" class="w-12 h-12 sm:w-15 sm:h-15 rounded-full object-cover" />
                      <h2 class="text-base sm:text-lg text-gray-800">{{ item.name }}</h2>
                    </RouterLink>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4 text-base sm:text-lg text-gray-700 whitespace-nowrap">
                {{ item.total_quantity.replace(".", ",") }}€
              </td>
              <td class="px-4 py-4 text-sm whitespace-nowrap">
                <div class="flex items-center gap-x-6">
                  <button @click="anadir(item)"
                    class="text-gray-500 transition-colors duration-200 hover:text-green-500 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="size-6 sm:size-7">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                  <button @click="sustraer(item)"
                    class="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="size-6 sm:size-7">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="hasMoreItems" class="hover:bg-gray-50 cursor-pointer" @click="loadMore">
              <td colspan="3" class="px-4 py-4 text-center">
                <div class="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700">
                  <span class="text-base sm:text-lg font-medium">Mostrar más</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Añadir -->
    <div v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75 transition-opacity">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Añadir a portfolio</h2>
        <label class="block mb-2 text-xl font-semibold text-gray-700">Cantidad actual: {{ selectedAsset?.total_quantity }}€</label>
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
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Sustraer de portfolio</h2>
        <label class="block mb-2 text-xl font-semibold text-gray-700">Cantidad actual: {{ selectedAsset?.total_quantity }}€</label>
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
  </div>
</template>