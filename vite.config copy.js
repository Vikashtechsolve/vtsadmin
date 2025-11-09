import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,      // React dev server
    open: true,      // Automatically open in browser
    host: true,      // Allow LAN access
    proxy: {
      "/api": {
        target: "http://localhost:8000", // 👈 Your Node backend
        changeOrigin: true,
        secure: false,                   // Disable SSL verification for local dev
        rewrite: (path) => path.replace(/^\/api/, "/api"), // optional (keeps same path)
      },
    },
  },
});
