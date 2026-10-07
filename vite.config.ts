import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the built assets work regardless of the GitHub Pages
// sub-path (e.g. https://<user>.github.io/<repo>/).
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
