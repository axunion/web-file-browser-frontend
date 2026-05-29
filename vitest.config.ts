import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: ["./src/test/setup.ts"],
			include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
			env: {
				VITE_ENDPOINT_API: "http://localhost/api/",
				VITE_ENDPOINT_DATA: "http://localhost/data/",
			},
		},
	}),
);
