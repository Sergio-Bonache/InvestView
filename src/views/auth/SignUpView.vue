<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const form = ref({ nombreUsuario: '', email: '', password: '', confirmPassword: '' });
const error = ref('');
const showModal = ref(false); // Controla la visibilidad del modal

function validarPassword(password) {
  // Al menos 8 caracteres, una mayúscula y un símbolo
  return (
    password.length > 8 &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

async function registrarUsuario() {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Validación de datos del formulario
  if (
    form.value.nombreUsuario.trim() === '' ||
    form.value.email.trim() === '' ||
    form.value.password.trim() === '' ||
    form.value.confirmPassword.trim() === ''
  ) {
    error.value = 'Es obligatorio introducir todos los datos.';
    return;
  } else if (!emailRegex.test(form.value.email)) {
    error.value = 'El correo electrónico no es válido.';
    return;
  } else if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  } else if (!validarPassword(form.value.password)) {
    error.value = 'La contraseña debe tener más de 8 caracteres, al menos una mayúscula y un símbolo.';
    return;
  }

  try {
    // Enviar datos al backend usando axios
    await axios.post('http://localhost:3000/users/register', {
      name: form.value.nombreUsuario,
      email: form.value.email,
      password: form.value.password,
    });

    // Si el registro es exitoso, mostrar el modal
    error.value = '';
    showModal.value = true;

    // Redirigir después de 2 segundos
    setTimeout(() => {
      showModal.value = false;
      router.push('/login');
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrar el usuario.';
    console.error(err);
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="mt-15 mb-15 pr-6 pl-6 w-full max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
        <!-- Formulario -->
        <div class="p-8 lg:p-12 flex flex-col justify-center">
          <h3 class="text-3xl font-bold text-blue-600 mb-6">Registro</h3>
          <h6 class="text-xl font-medium mb-4">Regístrate ahora</h6>
          <p class="text-lg text-gray-600 mb-4">Crea tu cuenta y únete a nosotros.</p>
          <form id="formRegistro" @submit.prevent="registrarUsuario" class="space-y-6">
            <div>
              <label for="username" class="block text-lg font-medium text-gray-700">Nombre de usuario</label>
              <input v-model="form.nombreUsuario" type="text" id="username" placeholder="Ingresa tu nombre de usuario"
                class="mt-1.5 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg" />
            </div>
            <div>
              <label for="email" class="block text-lg font-medium text-gray-700">Correo electrónico</label>
              <input v-model="form.email" type="text" id="email" placeholder="Ingresa tu correo electrónico"
                class="mt-1.5 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg" />
            </div>
            <div>
              <label for="password" class="block text-lg font-medium text-gray-700">Contraseña</label>
              <input v-model="form.password" type="password" id="password" placeholder="Ingresa tu contraseña"
                class="mt-1.5 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg" />
            </div>
            <div>
              <label for="confirmPassword" class="block text-lg font-medium text-gray-700">Confirmar contraseña</label>
              <input v-model="form.confirmPassword" type="password" id="confirmPassword"
                placeholder="Confirma tu contraseña"
                class="mt-1.5 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg" />
            </div>
            <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
            <div>
              <button type="submit"
                class="w-full bg-blue-600 font-bold text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-lg">
                Registrarse
              </button>
            </div>
            <div class="mt-6 text-center">
              <RouterLink to="/login" class="text-blue-600 hover:font-bold text-lg">
                <span class="text-black">¿Ya tienes cuenta?</span> ¡Inicia sesión!
              </RouterLink>
            </div>
          </form>
        </div>

        <!-- Columna imagen -->
        <div class="hidden lg:flex w-18/20 items-center justify-center">
          <img src="../../assets/images/money-bag-animal.png" class="w-full h-auto object-contain" />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:max-h-[90vh]">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex pt-2 sm:items-start">
          <div
            class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>

          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-xl font-semibold text-gray-900" id="modal-title">
            ¡Cuenta creada exitosamente!
            </h3>
            <div class="mt-2 pb-2">
            <p class="text-s text-gray-500">
              Redirigiendo a la página de inicio de sesión...
            </p>
            </div>
          </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>
