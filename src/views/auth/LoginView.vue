<script setup>
import router from "@/router";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const emit = defineEmits(["sesionIniciada"]);
const form = ref({ email: "", password: "" });
const error = ref("");

async function iniciarSesion() {
  if (form.value.email.trim() === "" || form.value.password.trim() === "") {
    error.value = "Por favor, completa todos los campos.";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al iniciar sesión.");
    }

    const usuario = await response.json();

    // Emitir evento para actualizar la sesión
    emit("sesionIniciada", {
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
      id: usuario.id,
    });

    // Guardar la sesión en localStorage
    localStorage.setItem(
      "sesion",
      JSON.stringify({
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
        id: usuario.id
      })
    );

    error.value = "";
    router.push("/"); // Redirigir al inicio
  } catch (err) {
    error.value = err.message;
    console.error(err);
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="mt-15 mb-15 pr-6 pl-6 w-full max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
        <!-- Formulario de login -->
        <div class="p-8 lg:p-12 flex flex-col justify-center">
          <h3 class="text-3xl font-bold text-blue-600 mb-6">Iniciar Sesión</h3>
          <h6 class="text-xl font-medium mb-4">¡Bienvenido de nuevo!</h6>
          <p class="text-lg text-gray-600 mb-8">
            Por favor, introduce tu correo y contraseña para iniciar sesión en tu cuenta.
          </p>
          <form @submit.prevent="iniciarSesion" class="space-y-8">
            <div>
              <label for="email" class="block text-lg font-medium text-gray-700">Correo electrónico</label>
              <input
                v-model="form.email"
                type="text"
                id="email"
                placeholder="Ingresa tu correo"
                class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            <div>
              <label for="password" class="block text-lg font-medium text-gray-700">Contraseña</label>
              <input
                v-model="form.password"
                type="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            <p v-if="error" class="text-red-500 text-lg">{{ error }}</p>
            <div>
              <button
                type="submit"
                class="w-full bg-blue-600 font-bold text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-lg"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
          <div class="mt-6 text-center">
            <RouterLink to="/signup" class="text-blue-600 hover:font-bold text-lg">
              <span class="text-black">¿No tienes cuenta?</span> ¡Regístrate!
            </RouterLink>
          </div>
        </div>

        <!-- Columna imagen -->
        <div class="hidden lg:flex w-9/10 items-center justify-center">
          <img
            src="../../assets/images/profit-penguin.png"
            class="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  </div>
</template>