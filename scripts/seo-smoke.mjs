// Post-build SEO guard. Run after `next build` (static export to ./out).
// Checks canonical host, sitemap/page parity, robots, JSON-LD and titles.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT = process.env.SEO_OUT_DIR || "out";
const HOST = "https://novamerchau.com";
const failures = [];
const fail = (msg) => failures.push(msg);

function read(rel) {
  const file = join(OUT, rel);
  if (!existsSync(file)) {
    fail(`missing build file: ${file}`);
    return "";
  }
  return readFileSync(file, "utf8");
}

const sitemapXml = read("sitemap.xml");
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) fail("sitemap has no URLs");

const robots = read("robots.txt");
if (!robots.includes(`Sitemap: ${HOST}/sitemap.xml`)) fail("robots.txt does not list the sitemap");
if (/^Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt disallows the whole site");

const titles = new Map();
for (const url of urls) {
  if (!url.startsWith(HOST)) {
    fail(`sitemap URL not on canonical host: ${url}`);
    continue;
  }
  const path = url.slice(HOST.length) || "/";
  const html = read(path === "/" ? "index.html" : join(path, "index.html"));
  if (!html) continue;

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const expected = path === "/" ? `${HOST}/` : url;
  if (canonical !== expected) fail(`${path}: canonical is ${canonical ?? "missing"}, expected ${expected}`);
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) fail(`${path}: noindex on a sitemap URL`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  if (!title) fail(`${path}: missing title`);
  else titles.set(title, [...(titles.get(title) ?? []), path]);

  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      fail(`${path}: invalid JSON-LD`);
    }
  }
}

for (const [title, paths] of titles) {
  if (paths.length > 1) fail(`duplicate title "${title}" on ${paths.join(", ")}`);
}

if (failures.length) {
  console.error(`SEO smoke failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`SEO smoke passed: ${urls.length} sitemap URLs checked.`);
