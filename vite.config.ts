import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import * as path from "path";
import styleImport, { VantResolve } from "vite-plugin-style-import";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        styleImport({
            resolves: [VantResolve()],
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            comps: path.resolve(__dirname, "src/components"),
            styles: path.resolve(__dirname, "src/styles"),
            plugins: path.resolve(__dirname, "src/plugins"),
            apis: path.resolve(__dirname, "src/apis"),
            utils: path.resolve(__dirname, "src/utils"),
            views: path.resolve(__dirname, "src/views"),
            stores: path.resolve(__dirname, "src/stores"),
            assets: path.resolve(__dirname, "src/assets"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "styles/global.scss";`,
            },
        },
    },
});
