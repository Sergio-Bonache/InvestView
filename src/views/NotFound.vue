<template>
    <section class="bg-white dark:bg-gray-900">
        <div class="container min-h-screen px-6 py-6 mx-auto lg:flex lg:items-center lg:gap-12">
            <div class="w-full lg:w-1/2">
                <p class="text-xl font-medium text-blue-500 dark:text-blue-400">Error 404</p>
                <h1 class="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Página no encontrada</h1>
                <p class="mt-4 text-gray-500 dark:text-gray-400">Lo sentimos, la página que estás buscando no existe. Vuelve a un lugar conocido:</p>

                <div class="flex items-center mt-6">
                    <router-link to="/" class="px-6 py-3 text-white text-l bg-blue-600 rounded-lg w-auto hover:bg-blue-700">
                        <button>
                            Llévame al inicio
                        </button>
                    </router-link>
                </div>
            </div>

            <div class="relative w-full mt-8 lg:w-1/2 lg:mt-0">
                <img class="w-full lg:h-[32rem] h-80 md:h-96 rounded-lg object-cover" src="https://images.unsplash.com/photo-1613310023042-ad79320c00ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Imagen de error 404">
            </div>
        </div>
    </section>
</template>