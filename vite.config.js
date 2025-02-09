import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          // Add any aliases you need here (example below)
          // '@components': '/src/components',
        },
      },
      // Optional: Configure the development server
      server: {
        port: 3000, // Change the port if needed
        open: true,  // Automatically open the browser
      },
    })