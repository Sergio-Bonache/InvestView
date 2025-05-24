<script setup>
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <footer class="text-gray-600 body-font bg-gray-200">
    <div class="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
      <div class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
        <a href="#" class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900" @click.prevent="scrollToTop">
          <img src="../assets/images/graph-arrow.png" alt="Home" class="h-12">
          <span class="ml-3 text-xl">InvestView</span>
        </a>
        <p class="mt-2 text-sm text-gray-500">La herramienta definitiva para gestionar y optimizar tu portafolio de inversión.</p>
      </div>
      <div class="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
        <div class="lg:w-1/3 md:w-1/2 w-full px-4">
          <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">RECURSOS</h2>
          <nav class="list-none mb-10">
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="/assets">Activos Disponibles</a>
            </li>
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="/portfolio">Mi Portafolio</a>
            </li>
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="/calculator/compound_interest">Calculadora de Interés Compuesto</a>
            </li>
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="/calculator/mortgage">Calculadora de Hipotecas</a>
            </li>
          </nav>
        </div>
        <div class="lg:w-1/3 md:w-1/2 w-full px-4">
          <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">HERRAMIENTAS</h2>
          <nav class="list-none mb-10">
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="/calculator/mortgage">Calculadora de Hipotecas</a>
            </li>
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="/calculator/compound_interest">Calculadora de Interés Compuesto</a>
            </li>
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="/assets">Activos de Inversión</a>
            </li>
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="/portfolio">Análisis de Portafolio</a>
            </li>
          </nav>
        </div>
        <div class="lg:w-1/3 md:w-1/2 w-full px-4">
          <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">SÍGUENOS</h2>
          <nav class="list-none mb-10">
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="https://www.linkedin.com/in/sergio-bonache-b1663633a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </li>
            <li>
              <a class="text-gray-600 hover:text-gray-800" href="https://www.instagram.com/bonache32" target="_blank" rel="noopener noreferrer">Instagram</a>
            </li>
          </nav>
        </div>
      </div>
    </div>
    <div class="bg-gray-300">
      <div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p class="text-gray-500 text-sm text-center sm:text-left">© 2025 InvestView — Todos los derechos reservados.</p>
        <span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <a class="ml-3 text-gray-500 hover:text-gray-800" href="https://www.instagram.com/bonache32" target="_blank" rel="noopener noreferrer">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a class="ml-3 text-gray-500 hover:text-gray-800" href="https://www.linkedin.com/in/sergio-bonache-b1663633a/" target="_blank" rel="noopener noreferrer">
            <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
              <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
        </span>
      </div>
    </div>
  </footer>
</template>