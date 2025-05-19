<script setup>
import { ref, onMounted } from "vue";

const original = ref(
  "../assets/img/baptist-standaert-mx0DEnfYxic-unsplash.jpg"
);
const processed = ref(null);

const previews = ref([]); // array de blobs

function createFormData(imgUrl) {
  const form = new FormData();

  // Convierte la URL local en un Blob
  const filePath = new URL(imgUrl, import.meta.url).pathname;
  const file = new File([filePath], "image.jpg");
  form.append("image", file);

  return form;
}
onMounted(async () => {
  // Cargar la imagen y procesarla al montar el componente
  const response = await fetch("http://localhost:5001/remove", {
    method: "POST",
    body: createFormData(original.value),
  });

  if (response.ok) {
    const blob = await response.blob();
    processed.value = URL.createObjectURL(blob);
  } else {
    console.error("Error al procesar la imagen");
  }
});
// Manejar archivos individuales
async function handleImage(file) {
  const form = new FormData();
  form.append("image", file);

  try {
    const response = await fetch("http://localhost:5001/remove", {
      method: "POST",
      body: form,
    });

    if (!response.ok) throw new Error("Error al eliminar fondo");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    previews.value.push(url);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Manejo del input (clic)
const fileInput = ref(null);

function onFileChange(event) {
  const files = Array.from(event.target.files);
  files.forEach((file) => handleImage(file));
}

// Drag & drop
function onDrop(event) {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  files.forEach((file) => handleImage(file));
}

function onDragOver(event) {
  event.preventDefault();
}
</script>

<template>
  <!-- <input type="file" @change="handleImage" accept="image/*" />
    <div v-if="preview">
      <h3>Resultado:</h3>
      <img :src="preview" alt="Resultado sin fondo" />
 
    </div> -->
  <!--HERO-->
  <section class="bg-stone-950">
    <div class="max-w-screen-xl mx-auto pb-24 pt-10 px-4 flex flex-wrap justify-center">
      <h1
        class="tornasol-text-title justify-between break-normal mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">
        Remove image backgrounds for free
      </h1>
      <p class="mb-8 font-normal text-gray-500 text-lg lg:text-xl dark:text-gray-400 text-center">
        Remove the background from any image in seconds and download it in
        professional HD quality.
      </p>
      <div class="flex flex-col justify-center items-center md:flex-row">
        <div class="grid grid-cols-2 gap-3 w-full sm:w-1/2">
          <img src="../assets/img/hero-photo-1.png" alt="image dog" />
          <img src="../assets/img/hero-photo-2.png" alt="image dog" />
          <img src="../assets/img/hero-photo-3.png" alt="image dog" />
          <img src="../assets/img/hero-photo-4.png" alt="image dog" />
        </div>
        <div class="bg-stone-950 flex flex-wrap items-center justify-center mt-4 w-full sm:w-1/2">
          <nuxt-link to="/upload" class="w-full md:ml-4">
            <div class="w-full space-y-6">
              <div
                class="w-full border-4 border-dashed border-gray-500 rounded-xl p-10 text-center cursor-pointer flex flex-col justify-center items-center text-white hover:border-white transition"
                @drop="onDrop" @dragover="onDragOver" @click="fileInput.click()">
                <!-- Dropzone -->
                <svg class="size-50 tornasol-text" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                  height="24" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16 18H8l2.5-6 2 4 1.5-2 2 4Zm-1-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 18h8l-2-4-1.5 2-2-4L8 18Zm7-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                </svg>
                <p class="text-sm text-gray-500">
                  Drag and drop your photo here or click to select it.
                </p>
              </div>
              <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl text-center">
                Remove the background from your images 100% free
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
  <section class="bg-stone-950">
    <div class="max-w-screen-xl mx-auto px-4 py-12 flex flex-col-reverse sm:flex-row justify-center items-center">
      <div class="w-full mb-4 sm:w-1/2 ">
        <h2 class="text-3xl md:text-5xl font-bold dark:text-white mb-6">
          Fast, automatic and<br /><span class="tornasol-text">easy to use</span>
        </h2>
        <ul class="text-balance space-y-1 text-gray-500 list-inside dark:text-gray-400">
          <li class="flex items-center mb-3">
            <svg class="w-5 h-5 me-2 text-green-500 dark:text-green-400 shrink-0" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span class="text-lg lg:text-xl"><strong> Instant resultsd </strong> – Upload your photo and get a
              background-free version in seconds.</span>
          </li>
          <li class="flex items-center mb-3">
            <svg class="w-5 h-5 me-2 text-green-500 dark:text-green-400 shrink-0" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span class="text-lg lg:text-xl"><strong> No editing skills required </strong> – No need for
              Photoshop or complex tools.</span>
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 me-2 text-green-500 dark:text-green-400 shrink-0" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span class="text-lg lg:text-xl"><strong> 100% free </strong> – Use the tool as many times as you
              want, with unlimited removals.</span>
          </li>
        </ul>
      </div>
      <div class="w-full mb-5 sm:mb-0 sm:w-1/2 ">
        <img src="../assets/img/hero-photo-1.png" alt="image dog" class="w-full sm:pl-10" />
      </div>
    </div>
  </section>
  <section class="bg-stone-950">
    <div class="max-w-screen-xl mx-auto px-4 py-12  flex flex-col sm:flex-row items-center justify-between">
      <div class="w-full mb-5 sm:mb-0 sm:w-1/2 ">
        <img src="../assets/img/hero-photo-1.png" alt="image dog" class="w-full sm:pr-10" />
      </div>

      <div class="w-full sm:w-1/2">
        <h2 class="text-3xl md:text-5xl  font-bold dark:text-white mb-8 ">
          What can you do with a<br />
          <span class="tornasol-text">background-free image?</span>
        </h2>
        <ul class="text-balance space-y-1 text-gray-500 list-inside dark:text-gray-400">
          <li class="flex items-center mb-3">
            <svg class="w-5 h-5 me-2 text-green-500 dark:text-green-400 shrink-0" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span class="text-lg lg:text-xl">Create cleaner product photos for online stores</span>
          </li>
          <li class="flex items-center mb-3">
            <svg class="w-5 h-5 me-2 text-green-500 dark:text-green-400 shrink-0" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span class="text-lg lg:text-xl">Make professional profile or resume pictures</span>
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 me-2 text-green-500 dark:text-green-400 shrink-0" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span class="text-lg lg:text-xl">Create stickers, memes, or custom designs</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
  <section class="bg-stone-950">
    <div class="max-w-screen-xl mx-auto px-4 py-12 ">
      <h2 class="text-3xl md:text-5xl font-bold dark:text-white text-center mb-8">
        <span class="tornasol-text">High quality</span> images
      </h2>
      <div class="mb-10">
        <ul class="flex flex-wrap justify-center mb-px text-sm font-medium text-center" id="default-tab"
          data-tabs-toggle="#default-tab-content" role="tablist">
          <li role="presentation">
            <button class="inline-block list-bg p-4 border-b-2 mr-2 rounded-full" id="profile-tab"
              data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">
              Peoples
            </button>
          </li>
          <li role="presentation">
            <button
              class="inline-block list-bg p-4 border-b-2 mr-2 rounded-full hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard"
              aria-selected="false">
              Products
            </button>
          </li>
          <li role="presentation">
            <button
              class="inline-block list-bg p-4 border-b-2 mr-2 rounded-full hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings"
              aria-selected="false">
              Animals
            </button>
          </li>
          <li role="presentation">
            <button
              class="inline-block list-bg p-4 border-b-2 rounded-full hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts"
              aria-selected="false">
              Graphics
            </button>
          </li>
        </ul>
      </div>
      <div id="default-tab-content">
        <div class="hidden rounded-lg" id="profile" role="tabpanel" aria-labelledby="profile-tab">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/people-photo-1.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/people-photo-2.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/people-photo-3.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/people-photo-4.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="hidden" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/product-photo-1.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/product-photo-2.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/product-photo-3.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/product-photo-4.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="hidden" id="settings" role="tabpanel" aria-labelledby="settings-tab">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/animals-photo-4.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/animals-photo-1.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/animals-photo-2.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/animals-photo-3.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="hidden" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/animals-photo-1.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/animals-photo-2.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/animals-photo-3.png" alt="" />
              </div>
            </div>
            <div class="grid gap-4">
              <div>
                <img class="h-auto max-w-full rounded-lg" src="../public/img/animals-photo-4.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="bg-stone-950 px-4 py-12 ">
    <div class="max-w-screen-xl mx-auto gap-4">
      <h2 class="text-3xl md:text-5xl font-bold dark:text-white text-center mb-4">
        <span class="tornasol-text">Boost your productivity</span> and creativity
      </h2>

      <p class="mb-8 font-normal text-gray-500 text-lg lg:text-xl dark:text-gray-400 text-center">
        Whether you want to design amazing greeting cards for your best friends or process thousands of car photos in
        seconds, photo removes <br /> is here to help.
      </p>
    </div>
    <div class="grid grid-cols-1 max-w-screen-xl mx-auto gap-4 sm:grid-cols-2 lg:flex">
      <div
        class="cursor-pointer max-w p-6 border border-gray-200 rounded-lg shadow-sm bg-stone-950 dark:border-gray-700 hover:border-gray-300 hover:bg-stone-900 transition">
        <svg class="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z" />
        </svg>

        <a href="#">
          <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">For Programmers</h5>
        </a>
        <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Go to this step by step guideline process on how to
          certify for your weekly benefits:</p>
      </div>
      <div
        class="cursor-pointer max-w p-6 border border-gray-200 rounded-lg shadow-sm bg-stone-950 dark:border-gray-700 hover:border-gray-300 hover:bg-stone-900 transition">

        <svg class="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd"
            d="M8.649 2.577A10.004 10.004 0 0 1 20.344 6.49a9.995 9.995 0 0 1 1.2 8.486l-.004.01-.005.015a2.958 2.958 0 0 1-2.836 2.001h-2.69a1.037 1.037 0 0 0-.95.68c-.047.13-.068.27-.06.409v.916A3.01 3.01 0 0 1 11.96 22a9.626 9.626 0 0 1-4.195-1l.009.005-.018-.009.01.004a10.1 10.1 0 0 1-5.716-7.996l-.001-.012a9.992 9.992 0 0 1 6.6-10.415Zm3.35 3.429a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12ZM8.53 7.518a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2h-.01Zm6.968 0a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM6.99 11.004a1 1 0 1 0 0 2H7a1 1 0 1 0 0-2h-.01Z"
            clip-rule="evenodd" />
        </svg>

        <a href="#">
          <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">For Designers</h5>
        </a>
        <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Go to this step by step guideline process on how to
          certify for your weekly benefits:</p>
      </div>
      <div
        class="cursor-pointer max-w p-6 border border-gray-200 rounded-lg shadow-sm bg-stone-950 dark:border-gray-700 hover:border-gray-300 hover:bg-stone-900 transition">
        <svg class="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd"
            d="M5.535 7.677c.313-.98.687-2.023.926-2.677H17.46c.253.63.646 1.64.977 2.61.166.487.312.953.416 1.347.11.42.148.675.148.779 0 .18-.032.355-.09.515-.06.161-.144.3-.243.412-.1.111-.21.192-.324.245a.809.809 0 0 1-.686 0 1.004 1.004 0 0 1-.324-.245c-.1-.112-.183-.25-.242-.412a1.473 1.473 0 0 1-.091-.515 1 1 0 1 0-2 0 1.4 1.4 0 0 1-.333.927.896.896 0 0 1-.667.323.896.896 0 0 1-.667-.323A1.401 1.401 0 0 1 13 9.736a1 1 0 1 0-2 0 1.4 1.4 0 0 1-.333.927.896.896 0 0 1-.667.323.896.896 0 0 1-.667-.323A1.4 1.4 0 0 1 9 9.74v-.008a1 1 0 0 0-2 .003v.008a1.504 1.504 0 0 1-.18.712 1.22 1.22 0 0 1-.146.209l-.007.007a1.01 1.01 0 0 1-.325.248.82.82 0 0 1-.316.08.973.973 0 0 1-.563-.256 1.224 1.224 0 0 1-.102-.103A1.518 1.518 0 0 1 5 9.724v-.006a2.543 2.543 0 0 1 .029-.207c.024-.132.06-.296.11-.49.098-.385.237-.85.395-1.344ZM4 12.112a3.521 3.521 0 0 1-1-2.376c0-.349.098-.8.202-1.208.112-.441.264-.95.428-1.46.327-1.024.715-2.104.958-2.767A1.985 1.985 0 0 1 6.456 3h11.01c.803 0 1.539.481 1.844 1.243.258.641.67 1.697 1.019 2.72a22.3 22.3 0 0 1 .457 1.487c.114.433.214.903.214 1.286 0 .412-.072.821-.214 1.207A3.288 3.288 0 0 1 20 12.16V19a2 2 0 0 1-2 2h-6a1 1 0 0 1-1-1v-4H8v4a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2v-6.888ZM13 15a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Z"
            clip-rule="evenodd" />
        </svg>

        <a href="#">
          <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">For Ecommerce</h5>
        </a>
        <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Go to this step by step guideline process on how to
          certify for your weekly benefits:</p>
      </div>
      <div
        class="cursor-pointer max-w p-6 border border-gray-200 rounded-lg shadow-sm bg-stone-950 dark:border-gray-700 hover:border-gray-300 hover:bg-stone-900 transition">
        <svg class="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd"
            d="M7.5 4.586A2 2 0 0 1 8.914 4h6.172a2 2 0 0 1 1.414.586L17.914 6H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1.086L7.5 4.586ZM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
            clip-rule="evenodd" />
        </svg>
        <a href="#">
          <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">For Photographers</h5>
        </a>
        <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Go to this step by step guideline process on how to
          certify for your weekly benefits:</p>
      </div>
    </div>
  </section>
  <section class="bg-stone-950">
    <div class="max-w-screen-xl mx-auto pb-24 pt-10 px-4 flex flex-col justify-center">
      <h2 class="text-3xl md:text-5xl font-bold dark:text-white text-center mb-4">
        Remove your <span class="tornasol-text">background now</span>
      </h2>
      <p class="mb-8 font-normal text-gray-500 text-lg lg:text-xl dark:text-gray-400 text-center">
        Get the transparent background of any image
      </p>
      <div class="flex justify-center">
        <div class="bg-stone-950 flex flex-wrap items-center justify-center">
          <nuxt-link to="/upload" class="w-full">
            <div class="max-w-4xl w-full mx-auto p-6 space-y-6">
              <div
                class="border-4 border-dashed border-gray-500 rounded-xl p-10 text-center cursor-pointer flex flex-col justify-center items-center text-white hover:border-white transition"
                @drop="onDrop" @dragover="onDragOver" @click="fileInput.click()">
                <!-- Dropzone -->
                <svg class="size-50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16 18H8l2.5-6 2 4 1.5-2 2 4Zm-1-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 18h8l-2-4-1.5 2-2-4L8 18Zm7-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                </svg>
                <p class="text-sm text-gray-500">
                  Drag and drop your photo here or click to select it.
                </p>
              </div>
              <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl text-center">
                Remove the background from your images 100% free
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.list-bg {
  border: none;
  background-color: #97979721;
}

.list-bg:hover {
  background: #9797974c;
  color: #fff;
}
</style>
