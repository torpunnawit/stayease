import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => {
  const config = {
    plugins: [react(), tailwindcss()],
    base: "/",
  };

  if (command !== "serve") {
    config.base = "/stayease";
  }

  return config;
});
