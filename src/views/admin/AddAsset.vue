<script setup>

import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const sesion = localStorage.getItem("sesion");
const rol = sesion ? JSON.parse(sesion).role : null;

if (rol != "admin") {
  router.push("/");
}

const form = ref({
  name: "",
  asset_type: "",
  description: "",
  trading_view_symbol: "",
  logo_url: ""
});
const error = ref("");
const showSuccessEditModal = ref(false);

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidAssetType(type) {
  const validTypes = ["accion", "ETF", "Cripto"];
  return validTypes.includes(type);
}

async function crearActivo() {
  // Validaciones básicas
  if (
    !form.value.name.trim() ||
    !form.value.asset_type.trim() ||
    !form.value.description.trim() ||
    !form.value.trading_view_symbol.trim() ||
    !form.value.logo_url.trim()
  ) {
    error.value = "Todos los campos son obligatorios.";
    return;
  }

  // Validar tipo de activo
  if (!isValidAssetType(form.value.asset_type)) {
    error.value = "El tipo de activo debe ser 'accion', 'ETF' o 'Cripto'.";
    return;
  }

  // Validar símbolo TradingView (debe contener ":")
  if (!form.value.trading_view_symbol.includes(":")) {
    error.value = "El símbolo de TradingView debe contener dos puntos (ejemplo: NASDAQ:AAPL).";
    return;
  }

  // Validar URL del logo
  if (!isValidUrl(form.value.logo_url)) {
    error.value = "La URL del logo no es válida.";
    return;
  }

  try {
    await axios.post("http://localhost:3000/assets", form.value);
    error.value = "";
    showSuccessEditModal.value = true;
    setTimeout(() => {
      showSuccessEditModal.value = false;
      router.push("/admin/assets");
    }, 1500);
  } catch (e) {
    error.value = e.response?.data?.message || "Error al crear el activo.";
    showSuccessEditModal.value = false;
  }
}
</script>

<template>
  <section class="container mt-15 mb-15 px-4 mx-auto max-w-2xl">
    <h2 class="text-3xl font-medium text-gray-800 dark:text-white mb-8">Añadir Nuevo Activo</h2>
    <form @submit.prevent="crearActivo" class="bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md p-6 space-y-6 border border-gray-200 dark:border-gray-700">
      <div>
        <label for="name" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nombre del activo</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Ej: Apple Inc."
          class="w-full rounded border-gray-300 bg-white dark:text-white shadow-sm py-2 px-4 outline-none"
        />
      </div>
      <div>
        <label for="asset_type" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Tipo de activo</label>
        <select
          id="asset_type"
          v-model="form.asset_type"
          class="w-full rounded border-gray-300 bg-white dark:text-white shadow-sm py-2 px-4 outline-none"
        >
          <option value="" disabled>Selecciona un tipo</option>
          <option value="accion">Acción</option>
          <option value="ETF">ETF</option>
          <option value="cripto">Cripto</option>
        </select>
      </div>
      <div>
        <label for="description" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Descripción</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Breve descripción del activo"
          class="w-full rounded border-gray-300 bg-white dark:text-white shadow-sm py-2 px-4 outline-none"
        ></textarea>
      </div>
      <div>
        <label for="trading_view_symbol" class="block text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center gap-2">
            Símbolo de TradingView
            <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer">
              <img
            src="https://authenticator.2stable.com/assets/img/2fa-services/Icons/tradingview.com.svg"
            alt="TradingView"
            class="rounded-full w-6 h-6 object-cover"
              />
            </a>
        </label>
        <input
          id="trading_view_symbol"
          v-model="form.trading_view_symbol"
          type="text"
          placeholder="Ej: NASDAQ:AAPL"
          class="w-full rounded border-gray-300 bg-white dark:text-white shadow-sm py-2 px-4 outline-none"
        />
      </div>
      <div>
        <label for="logo_url" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">URL del logo</label>
        <input
          id="logo_url"
          v-model="form.logo_url"
          type="text"
          placeholder="https://..."
          class="w-full rounded border-gray-300 bg-white dark:text-white shadow-sm py-2 px-4 outline-none"
        />
      </div>
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="form = { name: '', asset_type: '', description: '', trading_view_symbol: '', logo_url: '' }; error = '';"
          class="w-1/2 px-4 py-2 text-gray-900 font-semibold rounded-md hover:bg-gray-300">
          Limpiar
        </button>
        <button
          type="submit"
          class="w-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Añadir Activo
        </button>
      </div>
    </form>

    <!-- Modal de éxito de edición -->
    <div v-if="showSuccessEditModal" class="relative z-10" aria-labelledby="modal-title" role="alert" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:max-h-[90vh]">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex pt-2 sm:items-start">
                <div
                  class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div class="flex items-start justify-between">
                    <h3 class="text-2xl font-semibold text-gray-900" id="modal-title">
                      ¡Información actualizada exitosamente!
                    </h3>
                    <button type="button"
                      class="-mt-3 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                      aria-label="Close" @click="showSuccessEditModal = false">
                      <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-2 pb-2">
                    <p class="text-s text-gray-500">
                      Puedes continuar gestionando clientes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>