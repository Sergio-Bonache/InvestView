<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter();
const emit = defineEmits(["sesionCerrada"])
const props = defineProps({
  datosUsuario: Object,
  usuarioAutenticado: Object
})

function cerrarSesion() {
  emit("sesionCerrada", null)
  localStorage.removeItem("sesion")
  router.push("/")
}
</script>

<template>
  <nav class="bg-gray-200">
    <div class="container mx-auto flex items-center justify-between py-4 px-6">
      <!-- Logo -->
      <RouterLink class="flex items-center" to="/">
        <img src="../assets/images/graph-arrow.png" alt="Home" class="h-12">
        <h3 class="text-xl font-bold text-gray-700 ml-4 cursor-pointer" @click="router.push('/')">InvestView</h3>
      </RouterLink>

      <!-- Botón de menú para dispositivos pequeños -->
      <button class="lg:hidden text-gray-700 focus:outline-none" @click="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Opciones del menú -->
      <div class="hidden lg:flex items-center justify-center flex-grow space-x-6">
        <!-- Opciones de navbar para usuarios sin registrar -->
        <RouterLink v-if="datosUsuario?.role != 'admin'" class="text-gray-700 hover:text-black-600" to="/assets">Activos Disponibles</RouterLink>
        <RouterLink v-if="datosUsuario?.role != 'admin'" class="text-gray-700 hover:text-black-600" to="/portfolio">Mi Portafolio</RouterLink>
        <RouterLink v-if="datosUsuario?.role != 'admin'" class="text-gray-700 hover:text-black-600" to="/calculator/compound_interest">Calculadora de Interés Compuesto</RouterLink>
        <RouterLink v-if="datosUsuario?.role != 'admin'" class="text-gray-700 hover:text-black-600" to="/contact">Contacto</RouterLink>

        <RouterLink v-if="datosUsuario?.role == 'admin'" class="text-gray-700 hover:text-black-600" to="/crearActivo">
          Añadir Activo</RouterLink>
        <RouterLink v-if="datosUsuario?.role == 'admin'" class="text-gray-700 hover:text-black-600" to="/admin/assets">
          Gestionar Activos</RouterLink>
        <RouterLink v-if="datosUsuario?.role == 'admin'" class="text-gray-700 hover:text-black-600"
          to="/admin/users">Gestionar Usuarios</RouterLink>
      </div>

      <!-- Botones de login y signup si el usuario no está logueado -->
      <div v-if="!usuarioAutenticado" class="flex items-center space-x-4">
        <RouterLink to="/login">
          <button class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Iniciar Sesión</button>
        </RouterLink>
        <RouterLink to="/signup">
          <button
            class="border border-gray-800 text-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white">Crear
            Cuenta</button>
        </RouterLink>
      </div>

      <!-- Opciones para usuarios autenticados -->
      <div v-if="usuarioAutenticado" class="flex items-center space-x-4">
        <span class="text-gray-700">
          Bienvenido, {{ usuarioAutenticado.name.charAt(0).toUpperCase() + usuarioAutenticado.name.slice(1) }}
          <span v-if="usuarioAutenticado.role === 'admin'"> ({{ usuarioAutenticado.role }})</span>
        </span>
        <button @click="cerrarSesion" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400">Cerrar Sesión</button>
      </div>
    </div>
  </nav>

</template>
