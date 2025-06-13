<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const router = useRouter();
const emit = defineEmits(["sesionCerrada"])
const props = defineProps({
  datosUsuario: Object,
  usuarioAutenticado: Object
})

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function cerrarSesion() {
  try {
    emit("sesionCerrada");
    sessionStorage.clear();
    
    delete axios.defaults.headers.common["Authorization"];
    axios.defaults.headers.common = {};
    
    isMenuOpen.value = false;
    router.push("/login");
  } catch (e) {
    console.error("Error al cerrar sesión:", e);
    router.push("/");
  }
}
</script>

<template>
  <nav class="bg-gray-200">
    <div class="container mx-auto flex items-center justify-between py-4 px-6">
      <RouterLink class="flex items-center" to="/">
        <img src="../assets/images/graph-arrow.png" alt="Home" class="h-12">
        <h3 class="text-xl font-bold text-gray-700 ml-4 cursor-pointer" @click="router.push('/')">InvestView</h3>
      </RouterLink>

      <button class="lg:hidden text-gray-700 focus:outline-none" @click="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div class="hidden lg:flex items-center justify-center flex-grow space-x-6">
        <RouterLink v-if="datosUsuario?.role != 'admin'" class="text-gray-700 hover:text-black-600" to="/assets">Activos Disponibles</RouterLink>
        <RouterLink v-if="datosUsuario?.role != 'admin'" class="text-gray-700 hover:text-black-600" to="/portfolio">Mi Portafolio</RouterLink>
        <RouterLink v-if="datosUsuario?.role != 'admin'" class="text-gray-700 hover:text-black-600" to="/calculator/compound_interest">Calculadora de Interés Compuesto</RouterLink>
        <RouterLink v-if="datosUsuario?.role != 'admin'" class="text-gray-700 hover:text-black-600" to="/calculator/mortgage">Calculadora de hipotecas</RouterLink>

        <RouterLink v-if="datosUsuario?.role == 'admin'" class="text-gray-700 hover:text-black-600" to="/admin/assets/add">
          Añadir Activo</RouterLink>
        <RouterLink v-if="datosUsuario?.role == 'admin'" class="text-gray-700 hover:text-black-600" to="/admin/assets">
          Gestionar Activos</RouterLink>
        <RouterLink v-if="datosUsuario?.role == 'admin'" class="text-gray-700 hover:text-black-600"
          to="/admin/users">Gestionar Usuarios</RouterLink>
      </div>

      <div v-if="!usuarioAutenticado" class="hidden lg:flex items-center space-x-4">
        <RouterLink to="/login">
          <button class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Iniciar Sesión</button>
        </RouterLink>
        <RouterLink to="/signup">
          <button
            class="border border-gray-800 text-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white">Crear
            Cuenta</button>
        </RouterLink>
      </div>

      <div v-if="usuarioAutenticado" class="hidden lg:flex items-center space-x-4">
        <span class="text-gray-700">
          Bienvenido, {{ usuarioAutenticado.name.split(' ')[0].charAt(0).toUpperCase() + usuarioAutenticado.name.split(' ')[0].slice(1) }}
          <span v-if="usuarioAutenticado.role === 'admin'"> ({{ usuarioAutenticado.role }})</span>
        </span>
        <button @click="cerrarSesion" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400">Cerrar Sesión</button>
      </div>
    </div>

    <!-- Menú móvil -->
    <div v-if="isMenuOpen" class="lg:hidden bg-white shadow-lg">
      <div class="px-4 py-2 space-y-2">
        <!-- Opciones de navbar para usuarios sin registrar -->
        <RouterLink v-if="datosUsuario?.role != 'admin'" @click="isMenuOpen = false" class="block py-2 text-gray-700 hover:text-black-600" to="/assets">Activos Disponibles</RouterLink>
        <RouterLink v-if="datosUsuario?.role != 'admin'" @click="isMenuOpen = false" class="block py-2 text-gray-700 hover:text-black-600" to="/portfolio">Mi Portafolio</RouterLink>
        <RouterLink v-if="datosUsuario?.role != 'admin'" @click="isMenuOpen = false" class="block py-2 text-gray-700 hover:text-black-600" to="/calculator/compound_interest">Calculadora de Interés Compuesto</RouterLink>
        <RouterLink v-if="datosUsuario?.role != 'admin'" @click="isMenuOpen = false" class="block py-2 text-gray-700 hover:text-black-600" to="/calculator/mortgage">Calculadora de hipotecas</RouterLink>

        <RouterLink v-if="datosUsuario?.role == 'admin'" @click="isMenuOpen = false" class="block py-2 text-gray-700 hover:text-black-600" to="/admin/assets/add">
          Añadir Activo</RouterLink>
        <RouterLink v-if="datosUsuario?.role == 'admin'" @click="isMenuOpen = false" class="block py-2 text-gray-700 hover:text-black-600" to="/admin/assets">
          Gestionar Activos</RouterLink>
        <RouterLink v-if="datosUsuario?.role == 'admin'" @click="isMenuOpen = false" class="block py-2 text-gray-700 hover:text-black-600"
          to="/admin/users">Gestionar Usuarios</RouterLink>

        <!-- Botones de login y signup si el usuario no está logueado (móvil) -->
        <div v-if="!usuarioAutenticado" class="py-2 space-y-2">
          <RouterLink to="/login" @click="isMenuOpen = false">
            <button class="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Iniciar Sesión</button>
          </RouterLink>
          <RouterLink to="/signup" @click="isMenuOpen = false">
            <button class="w-full border border-gray-800 text-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white">
              Crear Cuenta
            </button>
          </RouterLink>
        </div>

        <!-- Opciones para usuarios autenticados (móvil) -->
        <div v-if="usuarioAutenticado" class="py-2">
          <button @click="cerrarSesion" class="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
