import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/input.css', '~/assets/css/main.css' ], 
  ssr: true,
  build: {
    transpile: ['flowbite']
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});