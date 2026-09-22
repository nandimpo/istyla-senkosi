import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import optimizedImages from "./build/optimizedImages";

// https://vite.dev/config/
export default defineConfig({
  plugins: [optimizedImages(), react()],
  base: "/istyla-senkosi/",
});
