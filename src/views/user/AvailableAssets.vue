<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const activos = ref([]);
const error = ref("");
const currentPage = ref(1);
const itemsPerPage = 12;

// Buscador
const searchText = ref("");

watch(searchText, () => {
    currentPage.value = 1;
});

onMounted(async () => {
    try {
        const response = await axios.get("http://localhost:3000/assets");
        activos.value = response.data;
    } catch (e) {
        error.value = e.response?.data?.message || "Error al obtener los activos.";
        activos.value = [];
    }
});

// Filtrado y paginación
const activosFiltrados = computed(() => {
    if (!searchText.value.trim()) return activos.value;
    return activos.value.filter(a =>
        a.name.toLowerCase().includes(searchText.value.trim().toLowerCase())
    );
});

const activosPaginados = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return activosFiltrados.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(activosFiltrados.value.length / itemsPerPage));

function cambiarPagina(pagina) {
    if (pagina >= 1 && pagina <= totalPages.value) {
        currentPage.value = pagina;
    }
}
</script>

<template>
    <section class="container mt-15 mb-15 px-4 mx-auto">
        <div class="flex items-center -mb-9 justify-between gap-x-3">
            <h2 class="text-3xl font-medium text-gray-800 dark:text-white">Activos Disponibles</h2>
            <div class="w-80">
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
        <div class="grid grid-cols-1 mt-15 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <RouterLink
                v-for="(activo, index) in activosPaginados"
                :key="index"
                :to="`/assets/${activo.trading_view_symbol}`"
                class="block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6">
                <div class="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                    <div class="sm:order-last sm:shrink-0">
                        <img alt="" :src="activo.logo_url" class="size-16 rounded-full object-cover sm:size-[72px]" />
                    </div>
                    <div class="mt-4 sm:mt-0">
                        <h3 class="text-lg font-medium text-pretty text-gray-900">
                            {{ activo.name }}
                        </h3>
                        <p class="mt-1 text-s text-gray-700">
                            {{ activo.trading_view_symbol.split(":")[1].replace("EUR", "") }}
                        </p>
                    </div>
                </div>
            </RouterLink>
        </div>
        <div class="flex items-center justify-between mt-9">
            <button @click="cambiarPagina(currentPage - 1)" :disabled="currentPage === 1"
                class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span>Anterior</span>
            </button>
            <div class="items-center hidden lg:flex gap-x-3">
                <button v-for="page in totalPages" :key="page" @click="cambiarPagina(page)"
                    :class="{ 'bg-blue-100/60 text-blue-500': currentPage === page, 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300': currentPage !== page }"
                    class="px-2 py-1 text-sm rounded-md">
                    {{ page }}
                </button>
            </div>
            <button @click="cambiarPagina(currentPage + 1)" :disabled="currentPage === totalPages"
                class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                <span>Siguiente</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </button>
        </div>
    </section>
</template>