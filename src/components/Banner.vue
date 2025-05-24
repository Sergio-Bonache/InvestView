<template>
  <section class="bg-white">
    <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
      <div class="mr-auto place-self-center lg:col-span-7">
        <h1
          class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
          Gestiona tu portafolio de inversión de manera eficiente
        </h1>
        <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">
          Organiza, analiza y optimiza tus inversiones en un solo lugar. Descubre herramientas diseñadas para ayudarte a
          alcanzar tus metas financieras.
        </p>
        <router-link to="/portfolio"
          class="inline-flex items-center justify-center px-12 py-3 mr-6 text-base font-medium text-center text-white text-lg bg-blue-600 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300">
          Comienza ahora ➤
        </router-link>
      </div>
      <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
        <img src="../assets/images/man-paper.png" alt="">
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Banner"
}
</script>
