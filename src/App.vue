<script setup>
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { ref } from 'vue';

// Control de sesión
const sesion = ref(JSON.parse(localStorage.getItem("sesion")));
function actualizaDatosSesion(usuario) {
  sesion.value = usuario;
  localStorage.setItem('sesion', JSON.stringify(usuario));
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header :usuarioAutenticado="sesion" @sesionCerrada="actualizaDatosSesion" :datosUsuario="sesion" />

    <!-- Contenido principal -->
    <main class="flex-grow">
      <RouterView @sesionIniciada="actualizaDatosSesion" />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

