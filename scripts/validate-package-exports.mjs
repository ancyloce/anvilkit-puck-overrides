import { accessSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(
  readFileSync(resolve(root, "package.json"), "utf8"),
);

const targets = new Set();

const collectTargets = (value) => {
  if (typeof value === "string" && value.startsWith("./")) {
    targets.add(value);
    return;
  }

  if (value && typeof value === "object") {
    for (const nestedValue of Object.values(value)) {
      collectTargets(nestedValue);
    }
  }
};

collectTargets(packageJson.exports);
collectTargets(packageJson.main);
collectTargets(packageJson.module);
collectTargets(packageJson.types);

const missingTargets = [...targets].filter((target) => {
  try {
    accessSync(resolve(root, target));
    return false;
  } catch {
    return true;
  }
});

if (missingTargets.length > 0) {
  console.error("package.json points to missing build artifacts:");

  for (const target of missingTargets) {
    console.error(`- ${target}`);
  }

  process.exit(1);
}

console.log(
  `Validated ${targets.size} package export target${targets.size === 1 ? "" : "s"}.`,
);
