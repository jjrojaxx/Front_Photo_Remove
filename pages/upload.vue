<script setup>
import { ref } from 'vue'
import JSZip from 'jszip'

const previews = ref([])         // URLs de las imágenes procesadas
const originalNames = ref([])    // Nombres originales de los archivos subidos
const selected = ref(null)       // Imagen actualmente mostrada
const selectedIndex = ref(null)  // Índice de la imagen seleccionada
const fileInput = ref(null)
const isDragging = ref(false)
const isLoading = ref(false)
const siteName = 'PhotoRemoves'     // Cambia aquí por el nombre real de tu sitio
const colorInput = ref(null)

function openFileDialog() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
function openColorDialog() {
    colorInput.value.click()
}

async function handleImage(event) {
  const files = event.target.files || event.dataTransfer.files
  if (!files.length) return

  isLoading.value = true
  for (const file of files) {
    const form = new FormData()
    form.append('image', file)

    try {
      const response = await fetch('http://localhost:5000/remove', {
        method: 'POST',
        body: form,
      })

      if (!response.ok) throw new Error('Error al eliminar fondo')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      previews.value.push(url)
      originalNames.value.push(file.name) // Guardamos el nombre original

      if (!selected.value) {
        selected.value = url
        selectedIndex.value = 0
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  isLoading.value = false
}

function handleDrop(event) {
  event.preventDefault()
  isDragging.value = false
  handleImage(event)
}

function selectImage(img, index) {
  selected.value = img
  selectedIndex.value = index
}

function downloadImage() {
  if (selectedIndex.value === null) return

  const url = selected.value
  const originalName = originalNames.value[selectedIndex.value] || 'image.png'

  // Crear nuevo nombre: nombreArchivo + _ + nombreSitio + .ext
  const extension = originalName.split('.').pop()
  const baseName = originalName.replace(/\.[^/.]+$/, '') // nombre sin extensión
  const fileName = `${baseName}_${siteName}.${extension}`

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function downloadAllAsZip() {
  if (previews.value.length === 0) return

  const zip = new JSZip()

  // Por cada imagen, bajamos el blob y lo agregamos al zip
  for (let i = 0; i < previews.value.length; i++) {
    const url = previews.value[i]
    const originalName = originalNames.value[i] || `image_${i + 1}.png`
    const extension = originalName.split('.').pop()
    const baseName = originalName.replace(/\.[^/.]+$/, '')
    const fileName = `${baseName}_${siteName}.${extension}`

    try {
      // Obtener el blob desde la URL creada con URL.createObjectURL(blob)
      const response = await fetch(url)
      const blob = await response.blob()
      zip.file(fileName, blob)
    } catch (error) {
      console.error('Error descargando imagen para zip:', error)
    }
  }

  // Generar el archivo zip
  const content = await zip.generateAsync({ type: 'blob' })

  // Crear link para descargar el zip
  const link = document.createElement('a')
  link.href = URL.createObjectURL(content)
  link.download = `${siteName}_images.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function removeImage(index) {
  if (selectedIndex.value === index) {
    selected.value = null
    selectedIndex.value = null
  }

  previews.value.splice(index, 1)
  originalNames.value.splice(index, 1)

  // Si había más imágenes, selecciona otra automáticamente
  if (previews.value.length > 0) {
    selected.value = previews.value[0]
    selectedIndex.value = 0
  }
}

</script>

<template>
  <section class="bg-stone-950 py-12 md:px-50 px-4 relative" @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false" @drop="handleDrop"
    :class="{ 'ring-4 ring-blue-500 ring-opacity-50': isDragging }">
    <div v-if="isDragging"
      class="absolute inset-0 flex items-center justify-center bg-blue-900 bg-opacity-70 text-white font-bold text-sm rounded-lg z-20 pointer-events-none">
      Soltar aquí
    </div>

    <div class="max-w-screen-md mx-auto rounded-lg">
      <h1 class="tornasol-text-title text-center font-extrabold text-3xl md:text-5xl mb-6">
        Upload an image to remove <br />the background
      </h1>

      <div class="flex flex-col sm:flex-row">
        <div v-if="selected" class="mt-8 w-full sm:w-1/2 flex items-center justify-center h-80">
          <img :src="selected" alt="Resultado sin fondo"
            class="inline-block w-full h-full object-contain rounded-lg shadow-lg border-2 border-gray-500" />
        </div>
        <div v-else
          class="border-2 bg-stone-900 border-white rounded-lg border-dashed flex flex-col justify-center items-center w-full h-80">
          <button @click.stop="openFileDialog"
            class="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
            Sube tu imagen
          </button>
          <span class="text-white">o arrastra tu archivo</span>
        </div>
        <!-- El if va aqui -->
        <div class="w-full sm:w-1/2 flex flex-col justify-center sm:ml-3">
          <div
            class="flex cursor-pointer items-center rounded-lg py-3 sm:p-3 hover:transition-all hover:bg-gray-900 hover:ml-2"
            id="dropdownDefaultButton" data-dropdown-toggle="dropdown" type="button">
            <span class="text-blue-700 py-3 px-3 bg-gray-950 border-1 rounded-full text-3xl font-bold">
              <svg class="w-6 h-6 text-blue-700 text-2xl font-bold" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 12h14m-7 7V5" />
              </svg>
            </span>
            <p class="font-mono font-medium ml-2 text-lg text-white">Background</p>
          </div>
          <div id="dropdown" class="z-10 w-100 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm  dark:bg-gray-900">
            <div class="mb-4 border-b border-gray-200 dark:border-gray-700 w-full">
              <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab"
                data-tabs-toggle="#default-tab-content" role="tablist">
                <li class="me-2" role="presentation">
                  <button class="inline-block p-4 border-b-2 rounded-t-lg" id="profile-tab" data-tabs-target="#profile"
                    type="button" role="tab" aria-controls="profile" aria-selected="false">Color</button>
                </li>
                <li class="me-2" role="presentation">
                  <button
                    class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard"
                    aria-selected="false">Fotos</button>
                </li>
              </ul>
            </div>
            <div id="default-tab-content" class="h-70 overflow-auto">
              <div class="hidden p-4 rounded-lg" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <div class="grid grid-cols-3 gap-2">
                  <div @click="openColorDialog" data-tooltip-target="tooltip-default" class="relative h-20 rounded-md transition-all hover:scale-103 cursor-pointer rainbow-circle flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                      height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M5 12h14m-7 7V5" />
                    </svg>
                    <input type="color" ref="colorInput" class="opacity-0 absolute bottom-0">
                  </div>
                  
                  <div id="tooltip-default" role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                    Add color code 🖍️
                    <div class="tooltip-arrow" data-popper-arrow></div>
                  </div>
                  <div class="bg-[#c0392b] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                  <div class="bg-[#9b59b6] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                  <div class="bg-[#2980b9] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                  <div class="bg-[#1abc9c] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                  <div class="bg-[#27ae60] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                  <div class="bg-[#f1c40f] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                  <div class="bg-[#e67e22] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                  <div class="bg-[#ecf0f1] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                  <div class="bg-[#95a5a6] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                  <div class="bg-[#34495e] h-20 rounded-md transition-all hover:scale-103 cursor-pointer"></div>
                </div>
              </div>
              <div class="hidden p-4 rounded-lg" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
                <div class="grid grid-cols-3 gap-2">
                  <img src="../public/img/bryan-goff-f7YQo-eYHdM-unsplash.jpg" alt=""
                    class="h-20 rounded-md transition-all hover:scale-103 cursor-pointer">
                  <img src="../public/img/benjamin-voros-phIFdC6lA4E-unsplash.jpg" alt=""
                    class="h-20 rounded-md transition-all hover:scale-103 cursor-pointer">
                  <img src="../public/img/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg" alt=""
                    class="h-20 rounded-md transition-all hover:scale-103 cursor-pointer">
                  <img src="../public/img/luca-bravo-zAjdgNXsMeg-unsplash.jpg" alt=""
                    class="h-20 rounded-md transition-all hover:scale-103 cursor-pointer">
                  <img src="../public/img/mohammad-alizade-4wzRuAb-KWs-unsplash.jpg" alt=""
                    class="h-20 rounded-md transition-all hover:scale-103 cursor-pointer">
                  <img src="../public/img/ken-cheung-KonWFWUaAuk-unsplash.jpg" alt=""
                    class="h-20 rounded-md transition-all hover:scale-103 cursor-pointer">
                  <img src="../public/img/cristina-gottardi-CSpjU6hYo_0-unsplash.jpg" alt=""
                    class="h-20 rounded-md transition-all hover:scale-103 cursor-pointer">
                  <img src="../public/img/daniela-cuevas-t7YycgAoVSw-unsplash.jpg" alt=""
                    class="h-20 rounded-md transition-all hover:scale-103 cursor-pointer">
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex cursor-pointer items-center rounded-lg sm:p-3 hover:transition-all hover:bg-gray-900 hover:ml-2">
            <span class="text-blue-700 py-3 px-3 bg-gray-950 border-1 rounded-full text-3xl font-bold">

              <svg class="w-6 h-6 text-blue-700 text-2xl font-bold" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z" />
              </svg>

            </span>
            <p class="font-mono font-medium ml-2 text-lg text-white">Effects</p>
          </div>
          <div class="flex flex-col">
            <button @click="downloadImage"
              class="cursor-pointer mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
              Download image
            </button>

            <button @click="downloadAllAsZip" v-if="previews.length > 1"
              class="cursor-pointer mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">
              Download the entire .zip list
            </button>

          </div>
        </div>
      </div>

      <input type="file" accept="image/*" ref="fileInput" multiple @change="handleImage" class="hidden" />
      <div v-if="isLoading" class="flex flex-col items-center justify-center mb-4 mt-4">
        <p class="text-white font-semibold mb-2">Processing image, please wait...</p>
        <svg class="animate-spin h-8 w-8 text-blue-900 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
          </circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
          </path>
        </svg>
      </div>
      <div v-if="previews.length"
        class="border-white border-2 mt-4 p-1 rounded-lg border-dashed flex gap-1 bg-stone-900 w-full max-w-screen-md overflow-x-auto whitespace-nowrap">
        <div class="flex gap-1 flex-nowrap">
          <div @click.stop="openFileDialog" title="add image"
            class="cursor-pointer h-20 w-24 rounded-lg border-dashed flex justify-center items-center bg-gray-800 hover:bg-gray-700 hover:transition-all active:bg-gray-900 shrink-0">
            <span class="text-4xl text-gray-400">+</span>
          </div>
          <div class="flex gap-1">
            <div class="relative group h-20 w-24" v-for="(img, index) in previews" :key="index">
              <button class="absolute right-1 top-1" @click.stop="removeImage(index)">
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white cursor-pointer hover:bg-red-600 bg-[#ff000086] opacity-0 group-hover:transition group-hover:opacity-100 hover:transition-all rounded-full"
                  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                  viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
              <img :src="img" @click="selectImage(img, index)" :class="[
                'cursor-pointer h-20 w-24 rounded-lg border-2 bg-gray-950 transition-all shrink-0',
                selected === img ? 'border-blue-500' : 'border-gray-500'
              ]" alt="Imagen sin fondo" />

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
 <style scoped>
 .rainbow-circle {
  background: conic-gradient(
    red,
    orange,
    yellow,
    lime,
    cyan,
    blue,
    violet,
    red
  );
}
</style>