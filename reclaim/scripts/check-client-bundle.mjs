// Fails if server-only material appears in browser bundles.
// Run after `npm run build`: npm run check:bundle
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const root = ".next/static";
const forbidden = [
  /ANTHROPIC_API_KEY/,
  /sk-ant-/,
  /RECLAIM_AI_ENABLED/,
  /You help write one short, structured response/, // system prompt
  /api\.anthropic\.com/,
];
if (process.env.ANTHROPIC_API_KEY) forbidden.push(new RegExp(process.env.ANTHROPIC_API_KEY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

let failed = false;
for (const file of walk(root)) {
  const text = readFileSync(file, "utf8");
  for (const re of forbidden) {
    if (re.test(text)) {
      console.error(`Forbidden pattern ${re} found in ${file}`);
      failed = true;
    }
  }
}
if (failed) process.exit(1);
console.log("Client bundle check passed: no secrets, system prompt or provider SDK found.");
