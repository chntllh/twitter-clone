import { defineConfig } from "vite";
import { config } from "dotenv";
import react from "@vitejs/plugin-react-swc";

config({ path: "../.env" });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "https://twitter-clone-backend-7wbw.onrender.com",
        secure: true,
      },
    },
  },
});
