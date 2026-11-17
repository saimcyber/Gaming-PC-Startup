import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base has to match the repo name because GitHub Pages serves the
// site from https://saimcyber.github.io/Gaming-PC-Startup/
export default defineConfig({
  plugins: [react()],
  base: '/Gaming-PC-Startup/',
})
