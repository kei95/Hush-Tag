import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";

import manifest from "./manifest.json";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
  plugins: [crx({ manifest })],
});
