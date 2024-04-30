import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    base: "",
    plugins: [svgr()],
});