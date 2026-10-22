// Builds a single-file, AI-off preview of Reclaim from the real components.
// Usage: node scripts/build-preview.mjs <output.html>
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] ?? resolve(root, "reclaim-preview.html");

const aliases = {
  "next/link": resolve(root, "scripts/preview/router.tsx"),
  "next/navigation": resolve(root, "scripts/preview/router.tsx"),
  "react/jsx-runtime": resolve(root, "scripts/preview/shims.ts"),
};

const reactGlobals = {
  name: "react-globals",
  setup(b) {
    b.onResolve({ filter: /^react(-dom\/client)?$/ }, (args) => ({ path: args.path, namespace: "global" }));
    b.onLoad({ filter: /.*/, namespace: "global" }, (args) => ({
      contents: args.path === "react" ? "module.exports = window.React;" : "module.exports = window.ReactDOM;",
    }));
    b.onResolve({ filter: /^(next\/link|next\/navigation|react\/jsx-runtime)$/ }, (args) => ({ path: aliases[args.path] }));
    b.onResolve({ filter: /^server-only$/ }, () => ({ path: "server-only", namespace: "empty" }));
    b.onResolve({ filter: /^@\/lib\/ai\/provider$/ }, () => ({ path: "provider", namespace: "stub" }));
    b.onLoad({ filter: /.*/, namespace: "empty" }, () => ({ contents: "" }));
    b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export const isAiEnabled = () => false;" }));
  },
};

const result = await build({
  entryPoints: [resolve(root, "scripts/preview/entry.tsx")],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  target: "es2017",
  jsx: "automatic",
  alias: { "@": resolve(root, "src") },
  define: {
    "process.env.NEXT_PUBLIC_RECLAIM_TELEGRAM_URL": JSON.stringify(process.env.NEXT_PUBLIC_RECLAIM_TELEGRAM_URL ?? ""),
    "process.env.NODE_ENV": '"production"',
  },
  plugins: [reactGlobals],
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = readFileSync(resolve(root, "src/app/globals.css"), "utf8");
const previewCss = `
body { background: var(--bg); }
.preview-banner { margin: 0; padding: 0.5rem max(16px, env(safe-area-inset-left, 0px)); font-size: 0.95rem;
  background: var(--amber-100); color: var(--ink); border-bottom: 1px solid var(--border); text-align: center; }`;

const html = `<title>Reclaim Preview</title>
<style>${css}${previewCss}</style>
<div id="reclaim-root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>${js}</script>
`;
writeFileSync(out, html);
console.log(`Preview written to ${out} (${Math.round(html.length / 1024)} KB)`);
