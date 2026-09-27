import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // относительные пути — сайт открывается и с GitHub Pages
  base: './',
  plugins: [react(), tailwindcss()],
})
