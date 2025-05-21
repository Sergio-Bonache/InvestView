<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const sesion = ref(null);
const portfolio = ref([]);
const error = ref("");

onMounted(async () => {
  sesion.value = localStorage.getItem("sesion") ? JSON.parse(localStorage.getItem("sesion")) : null;
  if (!sesion.value) {
    router.push("/login");
    return;
  }
  try {
    // Suponiendo que tienes un endpoint que devuelve el portfolio del usuario con cantidad > 0
    const response = await fetch(`http://localhost:3000/transactions/portfolio/${sesion.value.id}`);
    if (!response.ok) throw new Error("No se pudo obtener el portafolio.");
    const data = await response.json();
    // Filtra solo los activos con cantidad > 0
    console.log(data);
    portfolio.value = data;
  } catch (e) {
    error.value = e.message;
  }
});

function anadir(activo) {
  // Aquí puedes abrir un modal o redirigir a la vista de activo para añadir
  router.push(`/assets/${activo.trading_view_symbol}`);
}
function sustraer(activo) {
  // Aquí puedes abrir un modal o redirigir a la vista de activo para sustraer
  router.push(`/assets/${activo.trading_view_symbol}`);
}
</script>

<template>
  <section class="container mt-15 mb-15 px-4 mx-auto">
    <h2 class="text-3xl font-medium text-gray-800 mb-8">Mi Portafolio</h2>
    <div v-if="error" class="text-red-500 text-xl text-center py-10">{{ error }}</div>
    <div v-else-if="portfolio.length === 0" class="text-gray-500 text-center py-10">
      No tienes activos en tu portafolio.
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-6 py-4 text-left text-lg font-semibold text-gray-700">Activo</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-gray-700">Cantidad</th>
            <th class="px-6 py-4 text-left text-lg font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in portfolio" :key="item.asset_id" class="border-t">
            <td class="px-6 py-4 flex items-center gap-4">
              <img :src="item.logo_url" :alt="item.name" class="w-12 h-12 rounded-full object-cover border" />
              <span class="font-medium text-gray-800">{{ item.name }}</span>
            </td>
            <td class="px-6 py-4 text-lg text-gray-700">{{ item.total_quantity.replace(".",",") }}€</td>
            <td class="px-6 py-4 flex gap-2">
              <button
                @click="anadir(item)"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow transition"
              >
                Añadir
              </button>
              <button
                @click="sustraer(item)"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow transition"
              >
                Sustraer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <div class="flex flex-col mt-6">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col"
                                        class="py-3.5 px-4 text-l font-semibold text-left rtl:text-right text-gray-700 dark:text-gray-400 w-1/3">
                                        <div class="flex items-center gap-x-3">
                                            <span>Nombre</span>
                                        </div>
                                    </th>
                                    <th scope="col"
                                        class="px-4 py-3.5 text-l font-semibold text-left rtl:text-right text-gray-700 dark:text-gray-400 w-1/4">
                                        <button class="flex items-center gap-x-2">
                                            <span>Tipo</span>
                                        </button>
                                    </th>
                                    <th scope="col"
                                        class="px-4 py-3.5 text font-semibold text-left rtl:text-right text-gray-700 dark:text-gray-400 w-1/4">
                                        Descripción
                                    </th>
                                    <th scope="col"
                                        class="px-4 py-3.5 text font-semibold text-left rtl:text-right text-gray-700 dark:text-gray-400 w-1/4">
                                        Opciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                <tr v-for="item in portfolio" :key="item.asset_id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap w-1/4">
                                        <div class="inline-flex items-center gap-x-3">
                                            <div class="flex items-center gap-x-2">
                                                <div>
                                                    <h2 class="font-medium text-gray-800 dark:text-white">{{ item.name }}</h2>
                                                    <p class="text-sm font-normal text-gray-600 dark:text-gray-400">
                                                        {{ item.trading_view_symbol ? item.trading_view_symbol.split(":")[1].replace("EUR","") : '' }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap w-1/4">
                                        {{ item.asset_type ? item.asset_type.charAt(0).toUpperCase() + item.asset_type.slice(1) : '' }}
                                    </td>
                                    <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap w-1/4">
                                        {{ item.description }}
                                    </td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap w-1/4">
                                        <div class="flex items-center gap-x-6">
                                            <button @click="anadir(item)"
                                                class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.7" stroke="currentColor" class="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                            <button @click="sustraer(item)"
                                                class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
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
</template>