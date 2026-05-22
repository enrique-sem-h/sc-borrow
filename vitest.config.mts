import { defineConfig } from "vitest/config";
import nextEnv from "@next/env";
import path from "path";
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

export default defineConfig({
  test: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
