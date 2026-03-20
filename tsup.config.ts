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
      if (chunkInfo.type !== "chunk" || !/\.(cjs|js|mjs)$/.test(chunkInfo.path)) {
        return;
      }

      const fileStem = basename(chunkInfo.path, extname(chunkInfo.path)).replace(
        /[^a-zA-Z0-9]/g,
        "_",
      );
      const reservedNames = (chunkInfo.exports ?? []).map(
        (exportName) => `^${escapeRegExp(exportName)}$`,
      );
      const result = javascriptObfuscator.obfuscate(code, {
        optionsPreset: "low-obfuscation",
        compact: true,
        disableConsoleOutput: false,
        identifiersPrefix: `${this.format}_${fileStem}_`,
        ignoreImports: true,
        inputFileName: chunkInfo.path,
        renameGlobals: false,
        reservedNames,
        selfDefending: false,
        sourceMap: false,
        stringArrayEncoding: ["base64"],
        target: this.format === "cjs" ? "node" : "browser",
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
      });

      return {
        code: result.getObfuscatedCode(),
        map: null,
      };
    },
  };
}

function createBuildConfig(
  entry: Record<string, string>,
  splitting: boolean,
): Options {
  return {
    entry,
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: false,
    clean: false,
    treeshake: true,
    splitting,
    external: sharedExternal,
    minify: true,
    plugins: [createObfuscationPlugin()],
  };
}

export default defineConfig([
  createBuildConfig({ index: "src/index.ts" }, true),
  createBuildConfig({ legacy: "src/index.legacy.ts" }, false),
  createBuildConfig({ overrides: "src/core/overrides/index.tsx" }, false),
]);
