import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["heros-server.tail2e14dd.ts.net"],
    proxy: {
        '/local': {
            target: 'http://localhost:54321',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/local/, ''),
            }
        }
  },
});
