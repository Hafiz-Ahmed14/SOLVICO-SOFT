#!/usr/bin/env node
/**
 * Static verification for the SolvicoSoft site.
 *
 * `next build` is the real check, but it needs the npm registry. This harness
 * runs with zero dependencies and catches the classes of mistake that a build
 * would catch: unresolvable imports, links to routes that don't exist, missing
 * public assets, class names used in JSX that no CSS rule defines, dead `#`
 * hrefs, and unbalanced JSX.
 *
 *   node scripts/verify.mjs
 *
 * Exits non-zero on any failure so it can gate a commit.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const notes = [];
let checks = 0;

const fail = (file, msg) => failures.push(`${relative(ROOT, file)}: ${msg}`);
const ok = () => checks++;

/* ---------- collect source files ------------------------------------- */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const allFiles = walk(ROOT);
const sources = allFiles.filter((f) => /\.(tsx|ts)$/.test(f) && !f.includes("scripts/"));
const tsxFiles = sources.filter((f) => f.endsWith(".tsx"));
const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");

if (sources.length === 0) fail(ROOT, "no TypeScript sources found — wrong directory?");

/* ---------- 1. every relative / aliased import resolves -------------- */

const EXTS = ["", ".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts"];

function resolveImport(fromFile, spec) {
  let base;
  if (spec.startsWith("@/")) base = join(ROOT, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return true; // package import — not our problem here
  return EXTS.some((ext) => existsSync(base + ext));
}

for (const file of sources) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/(?:from|import)\s+["']([^"']+)["']/g)) {
    const spec = m[1];
    if (spec.endsWith(".css")) {
      const target = spec.startsWith(".") ? resolve(dirname(file), spec) : null;
      if (target && !existsSync(target)) fail(file, `stylesheet not found: ${spec}`);
      else ok();
      continue;
    }
    if (resolveImport(file, spec)) ok();
    else fail(file, `import does not resolve: ${spec}`);
  }
}

/* ---------- 2. internal hrefs map to real routes --------------------- */

function routeExists(route) {
  if (route === "/") return existsSync(join(ROOT, "app/page.tsx"));
  const segs = route.replace(/^\/|\/$/g, "").split("/");

  // literal directory
  if (existsSync(join(ROOT, "app", ...segs, "page.tsx"))) return true;

  // dynamic segment at the last position, e.g. /products/hmms
  const parent = join(ROOT, "app", ...segs.slice(0, -1));
  if (existsSync(parent)) {
    const dyn = readdirSync(parent).find((d) => /^\[.+\]$/.test(d));
    if (dyn && existsSync(join(parent, dyn, "page.tsx"))) return true;
  }
  return false;
}

const seenRoutes = new Set();

for (const file of tsxFiles) {
  const text = readFileSync(file, "utf8");

  // dead placeholder links — the single worst defect of the old site
  for (const _ of text.matchAll(/href=["']#["']/g)) fail(file, 'dead placeholder href="#"');

  for (const m of text.matchAll(/href=["'](\/[^"'{}$]*)["']/g)) {
    const route = m[1].split("#")[0].replace(/\/$/, "") || "/";
    if (route.startsWith("/api/") || route.startsWith("/img/")) continue;
    seenRoutes.add(route);
    if (routeExists(route)) ok();
    else fail(file, `href points at a route with no page: ${route}`);
  }

  // template-literal product links: /products/${p.slug}
  if (/href={`\/products\/\$\{/.test(text)) {
    if (existsSync(join(ROOT, "app/products/[slug]/page.tsx"))) ok();
    else fail(file, "links to /products/<slug> but app/products/[slug]/page.tsx is missing");
  }
}

// The nav lives in content/site.ts as data, not as href="" literals in JSX, so
// the scan above cannot see it. A nav entry pointing at a route with no page
// 404s from every page on the site, which is exactly how /member shipped
// broken, so check those hrefs explicitly.
{
  const siteText = readFileSync(join(ROOT, "content/site.ts"), "utf8");
  for (const m of siteText.matchAll(/href:\s*["'](\/[^"']*)["']/g)) {
    const route = m[1].split("#")[0].replace(/\/$/, "") || "/";
    seenRoutes.add(route);
    if (routeExists(route)) ok();
    else fail(join(ROOT, "content/site.ts"), `nav entry has no page: ${route}`);
  }
}

/* ---------- 3. every referenced public asset exists ------------------ *
   Matches any rooted path with a file extension, across every source file
   rather than just .tsx plus content/. The earlier version only looked at
   /img/ and /assets/ inside .tsx files, which meant app/manifest.ts could
   point its icons at files that were never there and still pass. An extension
   is what separates an asset path from a route path ("/products" has none). */

const ASSET_REF =
  /["'](\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|webp|avif|svg|gif|ico|pdf|woff2?))["']/g;

const assetRefs = new Set();
for (const file of sources) {
  for (const m of readFileSync(file, "utf8").matchAll(ASSET_REF)) assetRefs.add(m[1]);
}
for (const ref of assetRefs) {
  if (existsSync(join(ROOT, "public", ref))) ok();
  else fail(join(ROOT, "public"), `asset referenced but missing: ${ref}`);
}
if (assetRefs.size === 0) notes.push("no public assets referenced — check the images are wired up");

/* ---------- 4. every className used in JSX exists in the CSS -------- */

const definedClasses = new Set();
// Strip comments first (a multi-line comment's inner lines otherwise read as
// unterminated declarations), then url(...) payloads (hostnames inside a data
// URL otherwise read as class names).
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
const cssNoUrls = cssNoComments.replace(/url\((?:[^()]|\([^()]*\))*\)/g, "url()");
for (const m of cssNoUrls.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) definedClasses.add(m[1]);

// Classes applied programmatically (array join, computed prefix) rather than
// written as a literal, so the scanner below cannot see them.
const IGNORED = new Set(["reveal", "reveal-in", "reg-row-anim"]);

const usedClasses = new Map(); // class -> first file that used it
const usedPrefixes = new Map(); // "cell-" -> file, from `cell-${v}`

/** Pull the balanced {...} expression that starts at `open`. */
function braced(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return text.slice(open + 1, i);
    }
  }
  return "";
}

for (const file of tsxFiles) {
  const text = readFileSync(file, "utf8");

  const record = (raw) => {
    for (const c of raw.split(/\s+/).filter(Boolean)) {
      if (c.startsWith("$") || c.includes("{") || c.includes("}")) continue;
      // "cell-" is the literal half of `cell-${v}` — treat it as a family
      if (c.endsWith("-")) {
        if (!usedPrefixes.has(c)) usedPrefixes.set(c, file);
        continue;
      }
      if (!usedClasses.has(c)) usedClasses.set(c, file);
    }
  };

  // className="a b c"
  for (const m of text.matchAll(/className=["']([^"'{}]+)["']/g)) record(m[1]);

  // className={ ...anything... } — ternaries, template literals, joins
  for (const m of text.matchAll(/className=\{/g)) {
    const expr = braced(text, m.index + "className=".length);
    // template-literal holes become spaces so "cell cell-${v}" yields "cell"
    const flat = expr.replace(/\$\{[^}]*\}/g, " ");
    for (const lit of flat.matchAll(/["'`]([^"'`]*)["'`]/g)) record(lit[1]);
  }
}

for (const [cls, file] of usedClasses) {
  if (IGNORED.has(cls)) continue;
  if (definedClasses.has(cls)) ok();
  else fail(file, `className "${cls}" has no rule in app/globals.css`);
}

// a computed family such as cell-${v} must have at least one member defined
for (const [prefix, file] of usedPrefixes) {
  const members = [...definedClasses].filter((c) => c.startsWith(prefix) && c !== prefix);
  if (members.length) ok();
  else fail(file, `computed className "${prefix}\${…}" matches no rule in app/globals.css`);
}

/* ---------- 5. dead CSS: rules nothing uses -------------------------- */

const isUsed = (c) =>
  usedClasses.has(c) ||
  IGNORED.has(c) ||
  [...usedPrefixes.keys()].some((p) => c.startsWith(p) && c !== p);

const cssOnly = [...definedClasses].filter((c) => !isUsed(c));
if (cssOnly.length) {
  notes.push(`unused CSS classes (${cssOnly.length}): ${cssOnly.sort().join(", ")}`);
}

/* ---------- 6. JSX brace / tag balance ------------------------------- */

for (const file of tsxFiles) {
  const text = readFileSync(file, "utf8");
  const counts = { "{": 0, "}": 0, "(": 0, ")": 0 };
  let inStr = null;
  let inComment = null;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inComment === "line") {
      if (c === "\n") inComment = null;
      continue;
    }
    if (inComment === "block") {
      if (c === "*" && next === "/") {
        inComment = null;
        i++;
      }
      continue;
    }
    if (inStr) {
      if (c === "\\") i++;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === "/" && next === "/") { inComment = "line"; i++; continue; }
    if (c === "/" && next === "*") { inComment = "block"; i++; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c in counts) counts[c]++;
  }

  if (counts["{"] !== counts["}"]) {
    fail(file, `unbalanced braces: ${counts["{"]} { vs ${counts["}"]} }`);
  } else ok();
  if (counts["("] !== counts[")"]) {
    fail(file, `unbalanced parens: ${counts["("]} ( vs ${counts[")"]} )`);
  } else ok();
}

/* ---------- 7. accessibility + honesty spot checks ------------------- */

for (const file of tsxFiles) {
  const text = readFileSync(file, "utf8");

  for (const m of text.matchAll(/<Image\b[^>]*?\/>/gs)) {
    if (/\balt=/.test(m[0])) ok();
    else fail(file, "<Image> without an alt attribute");
  }
  for (const m of text.matchAll(/<img\b[^>]*?\/?>/gs)) {
    if (/\balt=/.test(m[0])) ok();
    else fail(file, "<img> without an alt attribute");
  }
  // every _blank needs a rel that includes noreferrer/noopener
  const blanks = (text.match(/target=["']_blank["']/g) || []).length;
  const rels = (text.match(/rel=["'](?:noreferrer|noopener)[^"']*["']/g) || []).length;
  if (blanks > rels) fail(file, `${blanks - rels} target="_blank" without rel="noreferrer"`);
  else ok();
}

// The audit's headline finding: no fabricated social proof in anything that
// ships to a visitor. README.md is exempt — it documents the omissions.
const BANNED = [
  /testimonial/i,
  /\bhundreds of (?:educational )?institutions\b/i,
  /payment gateway/i,
  /trusted by \d/i,
  /hamosoft/i,
  // Retired mailboxes from the old brand.
  /hafizmomo|hafizahmed373908/i,
  // Headcount, in any of the forms it has crept back in as.
  /\b(?:two|three|four)[\s-]+(?:engineers|developers|people|founders|team members)\b/i,
  /\bboth founders\b/i,
  /\bthe two of us\b/i,
  /\btwo-person\b/i,
];
for (const file of sources) {
  const text = readFileSync(file, "utf8");
  for (const re of BANNED) {
    // Every matching line is examined, not just the first. Checking only the
    // first let a file document a banned phrase in its header comment and then
    // use it for real further down.
    for (const line of text.split("\n")) {
      const hit = line.match(re);
      if (!hit) continue;
      // Comment lines may name what was deliberately dropped, so the rule is
      // documentable without being violable.
      if (/^\s*(?:\*|\/\/|#|<!--)/.test(line)) continue;
      fail(file, `re-introduces an unsupported claim: "${hit[0]}"`);
      break;
    }
  }
}

/* ---------- 8. the stylesheet itself parses -------------------------- */

const cssPath = join(ROOT, "app/globals.css");
{
  const opens = (css.match(/\{/g) || []).length;
  const closes = (css.match(/\}/g) || []).length;
  if (opens !== closes) fail(cssPath, `unbalanced braces: ${opens} { vs ${closes} }`);
  else ok();

  // any hex-looking token must be a real 3/4/6/8-digit hex colour
  for (const m of cssNoUrls.matchAll(/#([0-9a-zA-Z]+)/g)) {
    const v = m[1];
    if (/^(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)) ok();
    else fail(cssPath, `not a valid hex colour: #${v}`);
  }

  // declarations must be terminated — catches a dropped semicolon
  for (const block of cssNoUrls.matchAll(/\{([^{}]*)\}/g)) {
    for (const line of block[1].split("\n")) {
      const decl = line.split("/*")[0].trim();
      if (!decl || decl.endsWith(";") || decl.endsWith(",")) continue;
      fail(cssPath, `declaration is not terminated with ";": ${decl.slice(0, 60)}`);
    }
  }

  // every var(--x) must have a matching --x: declaration
  const declared = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  for (const m of css.matchAll(/var\((--[\w-]+)/g)) {
    if (declared.has(m[1]) || /^--font-plex-/.test(m[1])) ok();
    else fail(cssPath, `var(${m[1]}) is never declared`);
  }
}

/* ---------- 9. required files ---------------------------------------- */

/* app/icon.svg is deliberately absent — the mark now lives in public/brand/ and
   is wired up through metadata.icons in app/layout.tsx. Do not re-add it. */
const REQUIRED = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "app/not-found.tsx",
  "app/products/page.tsx",
  "app/products/[slug]/page.tsx",
  "app/about/page.tsx",
  "app/contact/page.tsx",
  "app/api/contact/route.ts",
  "app/sitemap.ts",
  "app/robots.ts",
  "content/site.ts",
  "content/products.ts",
  "package.json",
  "tsconfig.json",
  "next.config.mjs",
];
for (const rel of REQUIRED) {
  if (existsSync(join(ROOT, rel))) ok();
  else fail(ROOT, `required file missing: ${rel}`);
}

/* ---------- 10. client/server boundary ------------------------------- */

const CLIENT_ONLY = ["useState", "useEffect", "useRef", "usePathname", "onClick", "onSubmit"];
for (const file of tsxFiles) {
  const text = readFileSync(file, "utf8");
  const isClient = /^\s*["']use client["']/.test(text);
  const hit = CLIENT_ONLY.find((api) => new RegExp(`\\b${api}\\b`).test(text));
  if (hit && !isClient) fail(file, `uses ${hit} but is missing the "use client" directive`);
  else ok();
}

/* ---------- 11. unused imports and locals ---------------------------- */

for (const file of sources) {
  const text = readFileSync(file, "utf8");
  const importBlocks = [...text.matchAll(/import\s+(?:type\s+)?([^"']+?)\s+from\s+["'][^"']+["']/g)];

  for (const block of importBlocks) {
    const clause = block[1];
    const names = [];

    // default import
    const def = clause.match(/^\s*(?:type\s+)?([A-Za-z_$][\w$]*)\s*(?:,|$)/);
    if (def) names.push(def[1]);
    // named imports { a, b as c }
    const braces = clause.match(/\{([^}]*)\}/);
    if (braces) {
      for (const part of braces[1].split(",")) {
        const m = part.trim().match(/(?:type\s+)?(?:[A-Za-z_$][\w$]*\s+as\s+)?([A-Za-z_$][\w$]*)$/);
        if (m) names.push(m[1]);
      }
    }

    const body = text.slice(0, block.index) + text.slice(block.index + block[0].length);
    for (const name of names) {
      if (new RegExp(`\\b${name}\\b`).test(body)) ok();
      else fail(file, `unused import: ${name}`);
    }
  }

  // top-level const that is never referenced again
  for (const m of text.matchAll(/^const\s+([A-Za-z_$][\w$]*)\s*=/gm)) {
    const name = m[1];
    const body = text.slice(0, m.index) + text.slice(m.index + m[0].length);
    if (new RegExp(`\\b${name}\\b`).test(body)) ok();
    else fail(file, `unused top-level const: ${name}`);
  }
}

/* ---------- 12. WCAG AA contrast on the text pairs the design uses --- */

/*
 * The greys are the easiest thing to regress: lightening --slate-light by two
 * steps looks nicer in isolation and quietly fails AA for every caption on the
 * site. Values are read back out of the stylesheet, so editing a token
 * re-runs its check rather than going stale.
 */
{
  const tokens = new Map(
    [...css.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)].map((m) => [m[1], m[2]]),
  );
  const hexOf = (v) => (v.startsWith("--") ? tokens.get(v) : v);

  const srgb = (h) => {
    let s = h.replace("#", "");
    if (s.length === 3) s = [...s].map((c) => c + c).join("");
    return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
  };
  const chan = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const lum = (h) => {
    const [r, g, b] = srgb(h);
    return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
  };
  const contrast = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  // [label, foreground, background, px at which it renders]
  const PAIRS = [
    ["body text", "--ink", "--paper", 17],
    ["secondary text", "--slate", "--paper", 15],
    ["secondary on panels", "--slate", "--paper-2", 15],
    ["captions / mono data", "--slate-light", "--paper", 12],
    ["captions on panels", "--slate-light", "--paper-2", 12],
    ["accent link", "--mint", "--paper", 12],
    ["accent on tint", "--mint", "--mint-wash", 15],
    ["accent on dark", "--mint-bright", "--ink", 12],
    /* Header. The nav labels and the current-page cell sit on the accent tint,
       and the call to action is a solid amber block — the one place on the site
       where a label sits on a saturated ground, so it is also the easiest to
       break by reaching for white text. */
    ["header nav label", "--ink", "--paper", 16],
    ["header nav label on cell", "--ink", "--mint-wash", 16],
    ["header current page", "--mint", "--mint-wash", 16],
    ["header cta label", "--ink", "--amber", 16],
    ["header cta label, hovered", "--ink", "--amber-deep", 16],
    ["header submenu link", "--slate", "--paper", 15],
    ["footer link", "#b9c5c0", "--ink", 15],
    ["footer blurb", "#92a19c", "--ink", 15],
    ["footer heading", "#7f9189", "--ink", 12],
    ["footer legal bar", "#768881", "--ink", 12],
    ["dark-band lead", "#a7b5b0", "--ink", 17],
    ["solid button label", "#06120e", "--mint-bright", 15],
    ["error message", "#9c4a2c", "#fdf1ec", 15],
  ];

  for (const [label, fgRef, bgRef, px] of PAIRS) {
    const fg = hexOf(fgRef);
    const bg = hexOf(bgRef);
    if (!fg || !bg) {
      fail(cssPath, `contrast check refers to a token that no longer exists: ${fgRef} on ${bgRef}`);
      continue;
    }
    const need = px >= 18.66 ? 3 : 4.5; // AA: 3:1 for large text, 4.5:1 otherwise
    const got = contrast(fg, bg);
    if (got >= need) ok();
    else {
      fail(
        cssPath,
        `contrast ${got.toFixed(2)}:1 fails AA (needs ${need}:1) — ` +
          `${label}, ${fg} on ${bg} at ${px}px`,
      );
    }
  }

  // the tertiary grey must stay visibly lighter than the secondary one, or
  // the text hierarchy collapses even though both pass AA
  const slate = hexOf("--slate");
  const lightGrey = hexOf("--slate-light");
  if (slate && lightGrey) {
    const step = lum(lightGrey) / lum(slate);
    if (step >= 1.25) ok();
    else fail(cssPath, `--slate-light is only ${step.toFixed(2)}x lighter than --slate — no visible tier`);
  }
}

/* ---------- report ---------------------------------------------------- *
   The exit code is the whole point of this script: it gates `npm run check`.
   Without this block the file runs every assertion, prints nothing and exits
   0 — indistinguishable from a clean run, which is worse than no check at
   all. Anything that pushes to `failures` must reach the exit code here. */

if (notes.length) {
  console.log("\n  notes:");
  for (const n of notes) console.log(`  note  ${n}`);
}

if (failures.length) {
  console.log(`\n  ${failures.length} failure${failures.length === 1 ? "" : "s"}:`);
  for (const f of failures) console.log(`  FAIL  ${f}`);
  console.log(`\n  ✗ ${checks} assertions passed, ${failures.length} failed\n`);
  process.exit(1);
}

console.log(`\n  ✓ ${checks} assertions passed${notes.length ? `, ${notes.length} note(s)` : ""}\n`);
process.exit(0);

