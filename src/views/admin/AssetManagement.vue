<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

onMounted(() => {
    let sesion;
    try {
        sesion = JSON.parse(sessionStorage.getItem("sesion"));
    } catch (e) {
        sessionStorage.removeItem("sesion");
        router.push("/login");
        return;
    }

    // Si no hay sesión o no es admin, redirigir a login
    if (!sesion || sesion.role !== "admin") {
        sessionStorage.removeItem("sesion");
        router.push("/login");
        return;
    }

    // Establecer el header de autorización para todas las peticiones
    axios.defaults.headers.common["Authorization"] = `Bearer ${sesion.token}`;

    // Cargar activos después de configurar autenticación
    obtenerActivos();
});

const assets = ref([]);
const error = ref("");
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showSuccessEditModal = ref(false);
const showSuccessDeleteModal = ref(false);
const showErrorModal = ref(false);
const assetSeleccionado = ref(null);
const currentPage = ref(1);
const itemsPerPage = 7;

// Estado para el texto de búsqueda
const searchText = ref("");

// Función para obtener todos los activos
async function obtenerActivos() {
    try {
        const response = await axios.get("https://investviewback.onrender.com/assets");
        assets.value = response.data;
    } catch (e) {
        if (e.response?.status === 401 || e.response?.status === 403) {
            sessionStorage.removeItem("sesion");
            router.push("/login");
        } else {
            error.value = e.response?.data?.message || "Error al cargar los activos.";
        }
    }
}

// Computed para paginar y filtrar los activos
const assetsPaginados = computed(() => {
    let filtrados = assets.value;
    if (searchText.value.trim()) {
        filtrados = assets.value.filter(a =>
            a.name.toLowerCase().includes(searchText.value.trim().toLowerCase())
        );
    }
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtrados.slice(start, end);
});

// Total de páginas según filtrado
const totalPages = computed(() => {
    let filtrados = assets.value;
    if (searchText.value.trim()) {
        filtrados = assets.value.filter(a =>
            a.name.toLowerCase().includes(searchText.value.trim().toLowerCase())
        );
    }
    return Math.ceil(filtrados.length / itemsPerPage);
});

// Función para abrir el modal de edición
function abrirEditModal(asset) {
    assetSeleccionado.value = { ...asset };
    showEditModal.value = true;
}

// Función para abrir el modal de confirmación de eliminación
function abrirDeleteModal(asset) {
    assetSeleccionado.value = { ...asset };
    showDeleteModal.value = true;
}

// Función para guardar los cambios del activo
async function guardarCambios() {
    // Validaciones
    if (!assetSeleccionado.value.name.trim()) {
        error.value = "El nombre no puede estar vacío.";
        return;
    }
    if (!assetSeleccionado.value.description.trim()) {
        error.value = "La descripción no puede estar vacía.";
        return;
    }

    try {
        const response = await axios.put(`https://investviewback.onrender.com/assets/${assetSeleccionado.value.id}`, assetSeleccionado.value);
        await obtenerActivos();
        showEditModal.value = false;
        showSuccessEditModal.value = true;
        error.value = "";
    } catch (e) {
        if (e.response?.status === 401 || e.response?.status === 403) {
            sessionStorage.removeItem("sesion");
            router.push("/login");
        } else {
            error.value = e.response?.data?.message || "Error al guardar los cambios.";
            showEditModal.value = false;
            showErrorModal.value = true;
        }
    }
}

// Función para eliminar un activo
async function eliminarActivo() {
    try {
        await axios.delete(`https://investviewback.onrender.com/assets/${assetSeleccionado.value.id}`);
        await obtenerActivos();
        showDeleteModal.value = false;
        showSuccessDeleteModal.value = true;
    } catch (e) {
        if (e.response?.status === 401 || e.response?.status === 403) {
            sessionStorage.removeItem("sesion");
            router.push("/login");
        } else {
            error.value = e.response?.data?.message || "Error al eliminar el activo.";
            showDeleteModal.value = false;
            showErrorModal.value = true;
        }
    }
}

// Función para cambiar de página
function cambiarPagina(pagina) {
    if (pagina >= 1 && pagina <= totalPages.value) {
        currentPage.value = pagina;
    }
}
</script>

<template>
    <section class="container mt-15 mb-15 px-4 mx-auto">
        <div class="flex items-center justify-between gap-x-3">
            <div class="flex items-center gap-x-3">
                <h2 class="text-3xl font-medium text-gray-800">Administrar Activos</h2>
                <span class="px-2.5 py-0.5 mt-2 text-s text-blue-600 bg-blue-100 rounded-full">
                    {{ assets.length }} activos
                </span>
            </div>
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

        <div class="flex flex-col mt-6">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden border border-gray-200 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        class="py-3.5 px-4 text-l font-semibold text-left rtl:text-right text-gray-700 w-1/3">
                                        <div class="flex items-center gap-x-3">
                                            <span>Nombre</span>
                                        </div>
                                    </th>
                                    <th scope="col"
                                        class="px-4 py-3.5 text-l font-semibold text-left rtl:text-right text-gray-700 w-1/4">
                                        <button class="flex items-center gap-x-2">
                                            <span>Tipo</span>
                                        </button>
                                    </th>
                                    <th scope="col"
                                        class="px-4 py-3.5 text font-semibold text-left rtl:text-right text-gray-700 w-1/4">
                                        Descripción
                                    </th>
                                    <th scope="col"
                                        class="px-4 py-3.5 text font-semibold text-left rtl:text-right text-gray-700 w-1/4">
                                        Opciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="asset in assetsPaginados" :key="asset.id" class="hover:bg-gray-50">
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap w-1/4">
                                        <div class="inline-flex items-center gap-x-3">
                                            <div class="flex items-center gap-x-2">
                                                <div>
                                                    <h2 class="font-medium text-gray-800">{{ asset.name }}</h2>
                                                    <p class="text-sm font-normal text-gray-600">{{
                                                        asset.trading_view_symbol.split(":")[1].replace("EUR","") }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap w-1/4">
                                        {{ asset.asset_type.charAt(0).toUpperCase() + asset.asset_type.slice(1) }}
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap w-1/4">
                                        {{ asset.description }}
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap w-1/4">
                                        <div class="flex items-center gap-x-6">
                                            <button @click="abrirEditModal(asset)"
                                                class="text-gray-500 transition-colors duration-200 hover:text-yellow-500 focus:outline-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.7" stroke="currentColor" class="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                            <button @click="abrirDeleteModal(asset)"
                                                class="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.7" stroke="currentColor" class="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de edición -->
        <div v-if="showEditModal" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:max-h-[90vh]">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex pt-2 sm:items-start">
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-xl font-semibold text-gray-900 mb-4">Editar Activo</h3>
                                    <div class="space-y-4">
                                        <div>
                                            <label for="name"
                                                class="block text-l font-medium text-gray-700">Nombre</label>
                                            <input v-model="assetSeleccionado.name" type="text" id="name"
                                                class="mt-1 block w-107 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                        </div>
                                        <div>
                                            <label for="asset_type" class="block text-l font-medium text-gray-700">Tipo
                                                de Activo</label>
                                            <select v-model="assetSeleccionado.asset_type" id="asset_type"
                                                class="mt-1 block w-107 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                                <option value="accion">Accion</option>
                                                <option value="ETF">ETF</option>
                                                <option value="cripto">Cripto</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label for="description"
                                                class="block text-l font-medium text-gray-700">Descripción</label>
                                            <textarea v-model="assetSeleccionado.description" id="description"
                                                class="mt-1 block w-107 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                                        </div>
                                    </div>
                                    <div v-if="error" class="mt-4 text-red-500 text-sm">
                                        {{ error }}
                                    </div>
                                    <div class="mt-6 mb-2 flex justify-end space-x-4">
                                        <button @click="showEditModal = false; error = ''"
                                            class="w-1/2 px-4 py-2 text-gray-900 font-semibold rounded-md hover:bg-gray-300">
                                            Cancelar
                                        </button>
                                        <button @click="guardarCambios"
                                            class="w-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de éxito de edición -->
        <div v-if="showSuccessEditModal" class="relative z-10" aria-labelledby="modal-title" role="alert"
            aria-modal="true">
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

        <!-- Modal de confirmación de eliminación -->
        <div v-if="showDeleteModal" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:max-h-[90vh]">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex pt-2 sm:items-start">
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-xl font-semibold text-gray-900 mb-4">¿Estás seguro de que deseas
                                        eliminar a este activo?</h3>
                                    <p class="text-s text-gray-500">Esta acción no se puede deshacer.</p>
                                    <div class="mt-6 mb-2 flex justify-end space-x-4">
                                        <button @click="showDeleteModal = false"
                                            class="w-1/2 px-4 py-2 text-gray-900 font-semibold rounded-md hover:bg-gray-300">
                                            Cancelar
                                        </button>
                                        <button @click="eliminarActivo"
                                            class="w-1/2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de éxito de eliminación -->
        <div v-if="showSuccessDeleteModal" class="relative z-10" aria-labelledby="modal-title" role="alert"
            aria-modal="true">
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
                                <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <div class="flex items-start justify-between">
                                        <h3 class="text-2xl font-semibold text-gray-900" id="modal-title">
                                            ¡Activo eliminado exitosamente!
                                        </h3>
                                        <button type="button"
                                            class="-mt-3 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                                            aria-label="Close" @click="showSuccessDeleteModal = false">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="mt-2 pb-2">
                                        <p class="text-s text-gray-500">
                                            Puedes continuar gestionando activos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de error -->
        <div v-if="showErrorModal" class="relative z-10" aria-labelledby="modal-title" role="alert" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:max-h-[90vh]">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex pt-2 sm:items-start">
                                <div
                                    class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-200 text-red-700 sm:mx-0 sm:size-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="size-6">
                                        <path fill-rule="evenodd"
                                            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="mt-3 text-center w-full sm:mt-0 sm:ml-4 sm:text-left">
                                    <div class="flex items-start justify-between">
                                        <h3 class="text-2xl font-semibold text-gray-900" id="modal-title">
                                            Algo ha fallado...
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
                                            Vuelve a intentarlo en otro momento.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between mt-9">
            <button @click="cambiarPagina(currentPage - 1)" :disabled="currentPage === 1"
                class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span>Anterior</span>
            </button>
            <div class="items-center hidden lg:flex gap-x-3">
                <button v-for="page in totalPages" :key="page" @click="cambiarPagina(page)"
                    :class="{ 'bg-blue-100/60 text-blue-500': currentPage === page, 'text-gray-500 hover:bg-gray-100': currentPage !== page }"
                    class="px-2 py-1 text-sm rounded-md">
                    {{ page }}
                </button>
            </div>
            <button @click="cambiarPagina(currentPage + 1)" :disabled="currentPage === totalPages"
                class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100">
                <span>Siguiente</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </button>
        </div>
    </section>
</template>