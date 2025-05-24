<script setup>
import { ref, onMounted } from 'vue'
import Banner from '../components/Banner.vue';

</script>

<template>
  <Banner />
  <!-- Contenidos en 3 bloques-->
  <section class="text-gray-600 body-font">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-col text-center w-full mb-20">
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Gestiona tu portafolio de inversión
          en un solo lugar</h1>
        <p class="lg:w-2/3 mx-auto leading-relaxed text-base">InvestView te permite organizar, analizar y optimizar tus
          inversiones de manera sencilla. Descubre herramientas diseñadas para ayudarte a alcanzar tus objetivos
          financieros.</p>
      </div>
      <div class="flex flex-wrap -m-4">
        <div class="p-4 md:w-1/3">
          <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
            <div class="flex items-center mb-3">
              <div
                class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h2 class="text-gray-900 text-lg title-font font-medium">Organiza tus activos</h2>
            </div>
            <div class="flex-grow">
              <p class="leading-relaxed text-base">Registra y categoriza tus inversiones en un solo lugar para tener una
                visión clara de tu portafolio.</p>
            </div>
          </div>
        </div>
        <div class="p-4 md:w-1/3">
          <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
            <div class="flex items-center mb-3">
              <div
                class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2 class="text-gray-900 text-lg title-font font-medium">Analiza tu rendimiento</h2>
            </div>
            <div class="flex-grow">
              <p class="leading-relaxed text-base">Obtén estadísticas detalladas y gráficos para evaluar el desempeño de
                tus inversiones.</p>
            </div>
          </div>
        </div>
        <div class="p-4 md:w-1/3">
          <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
            <div class="flex items-center mb-3">
              <div
                class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  class="w-5 h-5" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>
                  <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                </svg>
              </div>
              <h2 class="text-gray-900 text-lg title-font font-medium">Optimiza tus decisiones</h2>
            </div>
            <div class="flex-grow">
              <p class="leading-relaxed text-base">Utiliza nuestras herramientas para tomar decisiones informadas y
                maximizar tus ganancias.</p>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-gray-200 my-8" />
    </div>
  </section>
  <!-- Calculadoras de inversión disponibles -->
  <section class="text-gray-600 -mt-12 body-font">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
        <div
          class="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 flex-shrink-0">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            class="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
          </svg>
        </div>
        <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
            <h2 class="text-gray-900 text-lg title-font font-medium mb-2">Calculadora de Hipotecas</h2>
            <p class="leading-relaxed text-base">Calcula tus pagos mensuales y el costo total de tu hipoteca para planificar mejor tus finanzas.</p>
            <RouterLink to="/calculator/mortgage" class="mt-3 text-blue-500 inline-flex items-center">Saber Más
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </RouterLink>
        </div>
      </div>
      <div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
        <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-2">Calculadora de Interés Compuesto</h2>
          <p class="leading-relaxed text-base">Descubre cómo tus inversiones pueden crecer con el tiempo gracias al
            interés compuesto.</p>
            <RouterLink to="/calculator/compound_interest" class="mt-3 text-blue-500 inline-flex items-center">Saber Más
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
            </RouterLink>
        </div>
        <div
          class="sm:w-32 sm:order-none order-first sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 flex-shrink-0">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            viewBox="0 0 32 32" class="sm:w-28 sm:h-28 w-10 h-10">
            <!-- Barras verticales -->
            <line x1="10" y1="20" x2="10" y2="23" />
            <line x1="13" y1="16" x2="13" y2="23" />
            <line x1="16" y1="18" x2="16" y2="23" />
            <line x1="19" y1="14" x2="19" y2="23" />
            <line x1="22" y1="10" x2="22" y2="23" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>
