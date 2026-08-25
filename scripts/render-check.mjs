
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require_ = createRequire(join(ROOT, "package.json"));

/* ---- transpile the app to plain CJS in a temp dir -------------------- */

const work = mkdtempSync(join(tmpdir(), "solvico-render-"));
const OUT = join(work, "out");

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(full)) out.push(full);
  }
  return out;
};
const inputs = ["app", "components", "content"].flatMap((d) => walk(join(ROOT, d)));

try {
  execFileSync(
    join(ROOT, "node_modules/.bin/tsc"),
    ["--jsx", "react-jsx", "--module", "commonjs", "--target", "es2020",
     "--moduleResolution", "node", "--esModuleInterop", "--skipLibCheck",
     "--outDir", OUT, "--rootDir", ROOT, ...inputs],
    { stdio: "pipe" },
  );
} catch {
  /* tsc exits non-zero on the stubbed next/* imports; the emit still happens.
     Run `npm run typecheck` for the authoritative type result. */
}

/* ---- stub next/* and the "@/" alias --------------------------------- */

const React = require_("react");
const { renderToStaticMarkup } = require_("react-dom/server");
const Module = require_("node:module");

const stubs = {
  "next/image": { __esModule: true,
    default: ({ src, alt, width, height }) =>
      React.createElement("img", { src, alt, width, height }) },
  "next/link": { __esModule: true,
    default: ({ href, children, ...rest }) =>
      React.createElement("a", { href, ...rest }, children) },
  "next/navigation": {
    notFound: () => { const e = new Error("NEXT_NOT_FOUND"); e.digest = "NEXT_NOT_FOUND"; throw e; },
    usePathname: () => "/" },
  "next/font/google": new Proxy({}, {
    get: () => () => ({ variable: "--stub", className: "stub" }) }),
};

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (req, ...rest) {
  if (stubs[req]) return req;
  if (req.startsWith("@/")) return origResolve.call(this, join(OUT, req.slice(2)), ...rest);
  // The emitted code lives in a temp dir, so bare specifiers like
  // "react/jsx-runtime" must be resolved from the project root instead.
  if (!req.startsWith(".") && !req.startsWith("/")) {
    try { return require_.resolve(req); } catch { /* fall through */ }
  }
  return origResolve.call(this, req, ...rest);
};
const origLoad = Module._load;
Module._load = function (req, ...rest) {
  if (stubs[req]) return stubs[req];
  return origLoad.call(this, req, ...rest);
};

/* ---- render ---------------------------------------------------------- */

const { productSlugs } = require_(join(OUT, "content/products.js"));

const routes = [
  ["/", "app/page.js", {}],
  ["/products", "app/products/page.js", {}],
  ["/member", "app/member/page.js", {}],
  ["/about", "app/about/page.js", {}],
  ["/contact", "app/contact/page.js", {}],
  ["/404", "app/not-found.js", {}],
  ...productSlugs.map((s) => [`/products/${s}`, "app/products/[slug]/page.js", { slug: s }]),
  ["/products/does-not-exist", "app/products/[slug]/page.js", { slug: "does-not-exist" }],
];

/* ---- reporting ------------------------------------------------------- *
   Every assertion below reports through these three. `bad` is the only thing
   that can set `failed`, and the process exit at the bottom reads it — so a
   silent script is a broken script, never a passing one. If this block goes
   missing the whole harness turns into an expensive no-op. */

let failed = 0;
const pass = (msg) => console.log(`  ok    ${msg}`);
const bad = (msg) => {
  failed++;
  console.log(`  FAIL  ${msg}`);
};
const check = (label, condition) => (condition ? pass(label) : bad(label));

const rendered = {};

console.log("\n  routes:");

for (const [label, file, params] of routes) {
  const Page = require_(join(OUT, file)).default;
  try {
    const html = renderToStaticMarkup(await Page({ params: Promise.resolve(params) }));
    rendered[label] = html;
    const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    pass(`${label.padEnd(26)} ${String(html.length).padStart(6)} bytes, ${words} words`);
  } catch (err) {
    if (err.digest === "NEXT_NOT_FOUND") { pass(`${label.padEnd(26)} correctly 404s`); continue; }
    bad(`${label} threw\n        ${err.stack.split("\n").slice(0, 4).join("\n        ")}`);
  }
}

/* ---- heading outline: exactly one h1, no skipped levels ------------- */

console.log("\n  heading outline:");

for (const [label, html] of Object.entries(rendered)) {
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  const h1s = levels.filter((l) => l === 1).length;
  const skips = levels.slice(1)
    .map((l, i) => (l - levels[i] > 1 ? `h${levels[i]}→h${l}` : null))
    .filter(Boolean);
  if (h1s !== 1) bad(`${label} has ${h1s} <h1> (needs exactly 1)`);
  else if (skips.length) bad(`${label} skips a heading level: ${skips.join(", ")}`);
  else pass(`${label.padEnd(26)} ${levels.map((l) => `h${l}`).join(" ")}`);
}

/* ---- the positioning, in the actual markup -------------------------- */

const home = rendered["/"] ?? "";
const all = Object.values(rendered).join("\n");
const { site } = require_(join(OUT, "content/site.js"));

/* Every negative assertion below passes vacuously against an empty string, so
   a page that throws would otherwise turn this whole section green. Establish
   that the markup exists before reading anything into it. */
console.log("\n  content:");
check(
  "every route produced markup",
  Object.keys(rendered).length === routes.length - 1 &&
    Object.values(rendered).every((h) => h.length > 500),
);

// Tied to content/site.ts rather than a copied string, so editing the heading
// cannot silently drop the positioning this whole site turns on.
check("home states the product-company model", home.includes(site.model.heading));
check("home never solicits requirements",
  !/your requirements|custom software|get a quote|discovery call/i.test(all));
check("home links every product", productSlugs.every((s) => home.includes(`/products/${s}`)));
check("home surfaces the live deployment", home.includes("bauet-hmms.runasp.net"));
check("no fabricated social proof", !/testimonial|trusted by \d|hundreds of/i.test(all));
// The retired identities: the old trading name and both old mailboxes.
check("no retired brand identity",
  !/hamosoft|hafizmomo|hafizahmed373908/i.test(all));
/* BAUET is dropped as base, origin story and credential. Exactly two
   occurrences of the string are permitted, both of which name a real artefact
   rather than making a claim:
     - the live HMMS deployment URL and its visible label
     - the filename of the screenshot taken of that deployment
   Anything else — prose, headings, alt text that describes the company as
   being of or from BAUET — still fails. Keep this list explicit; widening it
   to "any URL or filename" would let the origin story back in through an
   image name. */
const BAUET_ALLOWED = ["bauet-hmms.runasp.net", "/img/bauet-hmms-main.png"];
check("BAUET only ever appears as the deployment URL or its screenshot file",
  [...all.matchAll(/bauet/gi)].every((m) => {
    const context = all.slice(Math.max(0, m.index - 40), m.index + 40);
    return BAUET_ALLOWED.some((allowed) => context.includes(allowed));
  }));
check("no headcount claim anywhere",
  !/\b(?:two|three|four|2|3|4)[\s-]+(?:engineers|developers|people|founders|team members)\b/i
    .test(all) && !/\bboth founders\b|\bthe two of us\b|\btwo-person\b/i.test(all));
check('no dead href="#"', !/href="#"/.test(all));
check("every img has a non-empty alt",
  [...all.matchAll(/<img\b[^>]*>/g)].every((m) => /alt="[^"]+"/.test(m[0])));
check("no [object Object] or stray undefined",
  !/\[object Object\]|undefined<|>undefined/.test(all));
check("no NaN in markup", !/\bNaN\b/.test(all));

const contact = rendered["/contact"] ?? "";
check("every contact field is labelled", (contact.match(/<label/g) || []).length >= 5);
check("contact shows the current address",
  site.contact.addressLines.every((line) => contact.includes(line)) &&
    contact.includes(site.contact.email));

const routeCount = Object.keys(rendered).length;
console.log(
  failed
    ? `\n  ✗ ${failed} assertion${failed === 1 ? "" : "s"} failed across ${routeCount} rendered routes\n`
    : `\n  ✓ ${routeCount} routes rendered, all assertions passed\n`,
);

process.exit(failed ? 1 : 0);
