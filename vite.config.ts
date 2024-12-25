import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), UnoCSS()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
