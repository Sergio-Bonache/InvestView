<script setup>
import router from "@/router";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";

const emit = defineEmits(["sesionIniciada"]);
const form = ref({ email: "", password: "" });
const error = ref("");

async function iniciarSesion() {
  if (form.value.email.trim() === "" || form.value.password.trim() === "") {
    error.value = "Por favor, completa todos los campos.";
    return;
  }

  try {
    const response = await axios.post("https://investviewback.onrender.com/users/login", {
      email: form.value.email,
      password: form.value.password,
    });

    const sesion = {
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
      id: response.data.id,
      token: response.data.token
    };
    sessionStorage.setItem("sesion", JSON.stringify(sesion));

    axios.defaults.headers.common["Authorization"] = `Bearer ${sesion.token}`;

    emit("sesionIniciada", sesion);

    error.value = "";
    router.push("/"); 
  } catch (err) {
    error.value = err.response?.data?.message || "Error al iniciar sesión.";
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