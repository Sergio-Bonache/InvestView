<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Banner from '../components/Banner.vue';
import router from "@/router";

let preguntas = [
  {
    id: "One",
    titulo: "¿Qué es un free tour?",
    respuesta: "Un free tour es una visita guiada en la que no se paga un precio fijo, sino que los participantes pueden dar una propina al guía al final del recorrido según lo que consideren adecuado. Es una opción popular para explorar una ciudad con guías locales expertos."
  },
  {
    id: "Two",
    titulo: "¿Cuánto dura un free tour?",
    respuesta: "La duración de un free tour suele ser de entre 2 y 3 horas, dependiendo de la ciudad y el recorrido. Algunos tours pueden ser más cortos o más largos, pero en general, ofrecen una exploración básica de los puntos más importantes de la ciudad."
  },
  {
    id: "Three",
    titulo: "¿Quiénes son los guías?",
    respuesta: "Los guías de un free tour suelen ser personas locales con conocimientos sobre la historia, cultura y los puntos turísticos de la ciudad. Pueden ser guías profesionales o aficionados apasionados por compartir su conocimiento con los turistas."
  },
  {
    id: "Four",
    titulo: "¿Cuánto cuesta hacer un free tour?",
    respuesta: "El precio de un free tour es flexible, ya que no se cobra una tarifa fija. Al final del tour, los participantes pueden decidir cuánto quieren dar como propina al guía, dependiendo de su satisfacción con la experiencia."
  },
]

const fecha = ref('');
const fechaActual = new Date().toISOString().split('T')[0];
const localidad = ref('');
const localidades = ref([]);

//Función para obtener las localidades de las rutas disponibles
function obtenerLocalidadesRutas() {
  fetch("http://localhost/freetours/api.php/rutas")
    .then(response => response.json())
    .then(data => {
      localidades.value = data.filter(
        (ruta) => ruta.fecha >= new Date().toISOString().split("T")[0] && ruta.guia_id != null
      ).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).map(ruta => ruta.localidad);
    })
    .catch(error => {
      console.error("Error al obtener rutas:", error);
    });
}

//Función para buscar rutas disponibles en base a fecha y localidad del usuario
function buscarRuta() {
  router.push(`/rutasFiltradas/${fecha.value}/${localidad.value}`);
}


//Funciones para controlar el video

function cambiarEstadoVideo() {
  if (video.value) {
    estaActivo.value = !video.value.paused;
  }
}

function cambioPausarVer() {
  if (video.value) {
    if (video.value.paused) {
      video.value.play();
    } else {
      video.value.pause();
    }
  }
}

function reiniciarVideo() {
  if (video.value) {
    video.value.currentTime = 0;
    video.value.play();
  }
}

function sumarSeg() {
  if (video.value) {
    video.value.currentTime += 5;
  }
}

function restarSeg() {
  if (video.value) {
    video.value.currentTime -= 5;
  }
}

function subirVol() {
  if (video.value) {
    video.value.volume = Math.min(video.value.volume + 0.1, 1);
  }
}

function bajarVol() {
  if (video.value) {
    video.value.volume = Math.max(video.value.volume - 0.1, 0);
  }
}

function cambiarSilenciado() {
  if (video.value) {
    video.value.muted = !video.value.muted;
    estaSilenciado.value = video.value.muted;
  }
}

const video = ref(null);
const estaActivo = ref(false);
const estaSilenciado = ref(false);

onMounted(() => {
  if (video.value) {
    video.value.addEventListener('play', cambiarEstadoVideo);
    video.value.addEventListener('pause', cambiarEstadoVideo);
  }
});

onUnmounted(() => {
  if (video.value) {
    video.value.removeEventListener('play', cambiarEstadoVideo);
    video.value.removeEventListener('pause', cambiarEstadoVideo);
  }
});

onMounted(() => {
  obtenerLocalidadesRutas();
});

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
      <hr class="border-gray-200 my-8 dark:border-gray-700" />
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
          <a class="mt-3 text-blue-500 inline-flex items-center">Saber Más
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
        <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-2">Calculadora de Interés Compuesto</h2>
          <p class="leading-relaxed text-base">Descubre cómo tus inversiones pueden crecer con el tiempo gracias al
            interés compuesto.</p>
          <a class="mt-3 text-blue-500 inline-flex items-center">Saber Más
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
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
