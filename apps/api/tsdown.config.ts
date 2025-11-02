import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "./src/main.ts",
	// format: ["esm", "cjs"],
	format: "esm",
	outDir: "./dist",
	clean: true,
	noExternal: [/@tawasull\/.*/],
});
