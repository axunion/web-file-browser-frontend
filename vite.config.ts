import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	css: {
		transformer: "lightningcss",
		modules: {
			localsConvention: "camelCaseOnly",
		},
	},
	build: {
		cssMinify: "lightningcss",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
