import { defineConfig } from "vite";
import * as path from "path";

import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@workspace/ckeditor5-custom-build"],
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  base: "/",
  build: {
    chunkSizeWarningLimit: 3000,
    commonjsOptions: {
      include: [/@workspace\/ckeditor5-custom-build/, /node_modules/],
    },
  },
  server: {
    host: true,
    port: 3011,
    strictPort: true,
  },
});
