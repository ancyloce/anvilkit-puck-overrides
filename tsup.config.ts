import { basename, extname } from "node:path";
import javascriptObfuscator from "javascript-obfuscator";
import { defineConfig, type Options } from "tsup";

const sharedExternal = [
  "react",
  "react-dom",
  "@puckeditor/core",
  "@base-ui/react",
  "tailwindcss",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createObfuscationPlugin(): NonNullable<Options["plugins"]>[number] {
  return {
    name: "obfuscate-output",
    renderChunk(code, chunkInfo) {
      if (this.format === "cjs") return;
      if (chunkInfo.type !== "chunk" || !/\.(js|mjs)$/.test(chunkInfo.path)) return;

      const fileStem = basename(chunkInfo.path, extname(chunkInfo.path))
        .replace(/[^a-zA-Z0-9]/g, "_")
        .slice(0, 4); // ✅ shorter prefix

      const reservedNames = (chunkInfo.exports ?? []).map(
        (name) => `^${escapeRegExp(name)}$`,
      );

      const result = javascriptObfuscator.obfuscate(code, {
        optionsPreset: "low-obfuscation",
        compact: true,
        disableConsoleOutput: false,
        identifiersPrefix: `_${fileStem}_`,  // ✅ shorter
        ignoreImports: true,
        inputFileName: chunkInfo.path,
        renameGlobals: false,
        reservedNames,
        selfDefending: false,
        sourceMap: false,
        stringArray: false,           // ✅ remove rotation array entirely
        stringArrayEncoding: [],      // ✅ no encoding overhead
        stringArrayThreshold: 0,
        target: "browser",
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
      });

      return { code: result.getObfuscatedCode(), map: null };
    },
  };
}

// ✅ Single unified build — chunks shared across all entry points
export default defineConfig({
  entry: {
    index: "src/index.ts",
    legacy: "src/index.legacy.ts",
    overrides: "src/core/overrides/index.tsx",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  clean: true,
  treeshake: true,
  splitting: true,
  external: sharedExternal,
  minify: true,
  plugins: [createObfuscationPlugin()],
});