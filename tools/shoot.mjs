// Screenshots each frame tools/check.ts composed, at its canvas size, and
// runs the frame runtime's three audits on it: contrast, overflow and the 4px
// spacing scale. Zeros computes these while it draws a frame but never shows
// them (issue 6 in README.md). auditPage follows auditWarnings in the Zeros
// file packages/protocol/src/design-runtime.ts, colour parsing included, so
// its oklch() problem (issue 4) shows here too.
//
//   node tools/shoot.mjs [out-dir] [frame-regex]
//
// Every network request is refused: composed frames inline their resources.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const zeros = process.env.ZEROS_REPO;
if (!zeros) {
  console.error("Set ZEROS_REPO to a Zeros checkout with its dependencies installed.");
  process.exit(2);
}
const { chromium } = createRequire(path.join(path.resolve(zeros), "package.json"))("@playwright/test");
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(process.argv[2] ?? path.join(here, "out"));
const only = process.argv[3] ? new RegExp(process.argv[3]) : null;
const { items } = JSON.parse(fs.readFileSync(path.join(out, "manifest.json"), "utf8"));
const shots = path.join(out, "shots");
fs.mkdirSync(shots, { recursive: true });

function auditPage() {
  var MAX_AUDIT_WARNINGS = 128;
  var MAX_AUDIT_ELEMENTS = 5000;
  // The runtime audits the first element carrying each data-oid, then body.
  var elementsByOid = new Map();
  var body = document.body;
  if (body && body.getAttribute("data-oid")) elementsByOid.set(body.getAttribute("data-oid"), body);
  for (var node of (body || document.documentElement).querySelectorAll("[data-oid]")) {
    var id = node.getAttribute("data-oid");
    if (id && !elementsByOid.has(id)) elementsByOid.set(id, node);
  }
  if (body) elementsByOid.set("::zeros-document-body", body);
  function hiddenBy(element) {
    var invisibleSelf = false;
    for (var current = element; current && current instanceof Element; current = current.parentElement) {
      var style = getComputedStyle(current);
      var removed = current.hidden || style.display === "none";
      var invisible = style.visibility === "hidden" || style.visibility === "collapse";
      if (current === element) {
        if (removed) return "self";
        if (invisible) invisibleSelf = true;
        continue;
      }
      if (removed || invisible) return "ancestor";
    }
    return invisibleSelf ? "self" : null;
  }
  function parsedColor(value) {
    var parts = String(value || "").match(/[0-9.]+/g);
    if (!parts || parts.length < 3) return null;
    return {
      r: Math.max(0, Math.min(255, Number(parts[0]))) / 255,
      g: Math.max(0, Math.min(255, Number(parts[1]))) / 255,
      b: Math.max(0, Math.min(255, Number(parts[2]))) / 255,
      a: parts.length > 3 ? Math.max(0, Math.min(1, Number(parts[3]))) : 1,
    };
  }
  function composite(f, b) {
    var a = f.a + b.a * (1 - f.a);
    if (a <= 0) return { r: 1, g: 1, b: 1, a: 1 };
    return { r: (f.r * f.a + b.r * b.a * (1 - f.a)) / a, g: (f.g * f.a + b.g * b.a * (1 - f.a)) / a, b: (f.b * f.a + b.b * b.a * (1 - f.a)) / a, a: a };
  }
  function backgroundColorOf(element) {
    var layers = [];
    for (var current = element; current && current instanceof Element; current = current.parentElement) {
      var layer = parsedColor(getComputedStyle(current).backgroundColor);
      if (layer && layer.a > 0) layers.push(layer);
    }
    var result = { r: 1, g: 1, b: 1, a: 1 };
    for (var i = layers.length - 1; i >= 0; i -= 1) result = composite(layers[i], result);
    return result;
  }
  function luminance(c) {
    function channel(v) { return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
  }
  function contrastRatio(f, b) {
    var x = luminance(composite(f, b)), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function pixelValue(value) {
    var match = /^(-?[0-9]+(?:\.[0-9]+)?)px$/.exec(String(value || "").trim());
    return match ? Number(match[1]) : null;
  }
  function directText(element) {
    var pieces = [];
    for (var child of element.childNodes) if (child.nodeType === Node.TEXT_NODE && child.textContent) pieces.push(child.textContent);
    var text = pieces.join(" ").replace(/\s+/g, " ").trim();
    return text ? text.slice(0, 120) : null;
  }
  var warnings = [];
  var seen = new Set();
  var audited = 0;
  function add(ruleId, oid, message, detail) {
    var key = ruleId + "\u0000" + oid;
    if (seen.has(key) || warnings.length >= MAX_AUDIT_WARNINGS) return;
    seen.add(key);
    warnings.push({ ruleId: ruleId, oid: oid, message: message, detail: detail });
  }
  elementsByOid.forEach(function (element, oid) {
    if (audited >= MAX_AUDIT_ELEMENTS) return;
    audited += 1;
    if (hiddenBy(element) !== null) return;
    var computed = getComputedStyle(element);
    if ((element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1) ||
      (element.clientHeight > 0 && element.scrollHeight > element.clientHeight + 1)) {
      add("overflow", oid, "Content overflows this element's layout box.",
        "content " + element.scrollWidth + "x" + element.scrollHeight + "px in a " + element.clientWidth + "x" + element.clientHeight + "px box");
    }
    var offScale = [];
    for (var property of ["gap", "rowGap", "columnGap", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginRight", "marginBottom", "marginLeft"]) {
      var pixels = pixelValue(computed[property]);
      if (pixels !== null && Math.abs(pixels) > 0.01 && Math.abs(pixels / 4 - Math.round(pixels / 4)) > 0.01) offScale.push(property + "=" + pixels + "px");
    }
    if (offScale.length > 0) add("spacing-scale", oid, "Spacing is off the 4px design scale: " + offScale.slice(0, 3).join(", ") + ".", "");
    var text = directText(element);
    if (text) {
      var foreground = parsedColor(computed.color);
      if (foreground) {
        var ratio = contrastRatio(foreground, backgroundColorOf(element));
        var fontSize = pixelValue(computed.fontSize) || 0;
        var weight = Number(computed.fontWeight) || 400;
        var threshold = fontSize >= 24 || (fontSize >= 18.66 && weight >= 700) ? 3 : 4.5;
        if (ratio + 0.01 < threshold) {
          add("contrast", oid, "Text contrast is " + ratio.toFixed(2) + ":1; this text needs at least " + threshold.toFixed(1) + ":1.",
            "\"" + text.slice(0, 40) + "\", color " + computed.color);
        }
      }
    }
  });
  if (elementsByOid.size > MAX_AUDIT_ELEMENTS) add("audit-limit", "frame", "The design audit sampled the first " + MAX_AUDIT_ELEMENTS + " authored elements.", "");
  return warnings;
}

const browser = await chromium.launch();
const results = [];
try {
  for (const item of items) {
    if (only && !only.test(item.file)) continue;
    const context = await browser.newContext({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await context.newPage();
    const blocked = [];
    await page.route("**/*", (route) => { blocked.push(route.request().url().slice(0, 120)); return route.abort(); });
    const errors = [];
    page.on("pageerror", (error) => errors.push(String(error).slice(0, 200)));
    await page.setContent(fs.readFileSync(path.join(out, `${item.name}.html`), "utf8"), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    const png = path.join(shots, `${item.name}.png`);
    await page.screenshot({ path: png });
    const audit = await page.evaluate(auditPage);
    const scroll = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
    // The height a .sheet frame's content needs: its last child's bottom edge plus the sheet's bottom padding.
    const fit = await page.evaluate(() => {
      const main = document.querySelector("main.sheet");
      const last = main?.lastElementChild;
      if (!main || !last) return null;
      return Math.ceil(last.getBoundingClientRect().bottom + (parseFloat(getComputedStyle(main).paddingBottom) || 0));
    });
    const clipped = scroll.height > item.height + 1 || scroll.width > item.width + 1;
    results.push({ file: item.file, theme: item.theme, png: path.relative(out, png), width: item.width, height: item.height, fit, clipped: clipped ? scroll : undefined,
      blocked: blocked.length ? blocked : undefined, errors: errors.length ? errors : undefined, audit });
    await context.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(out, "audit.json"), JSON.stringify(results, null, 2) + "\n");

const totals = {};
const lines = [];
for (const result of results) {
  for (const warning of result.audit) totals[`${result.theme} ${warning.ruleId}`] = (totals[`${result.theme} ${warning.ruleId}`] ?? 0) + 1;
  const extra = [
    result.clipped ? `  frame: the content is ${result.clipped.width}x${result.clipped.height}px, larger than the ${result.width}x${result.height}px frame` : null,
    ...(result.errors ?? []).map((error) => `  page error: ${error}`),
    ...(result.blocked ?? []).map((url) => `  blocked request: ${url}`),
  ].filter(Boolean);
  if (!result.audit.length && !extra.length) continue;
  lines.push("", `${result.file} (${result.theme})`);
  for (const warning of result.audit) lines.push(`  ${warning.ruleId} ${warning.oid}: ${warning.message}${warning.detail ? ` ${warning.detail}` : ""}`);
  lines.push(...extra);
}
const counted = Object.entries(totals).sort(([a], [b]) => a.localeCompare(b)).map(([rule, count]) => `  ${String(count).padStart(3)}  ${rule}`);
console.log([`Audited ${results.length} frame renders; screenshots in ${path.relative(process.cwd(), shots) || shots}.`,
  counted.length ? "Audit warnings by theme and rule:" : "No audit warnings.", ...counted, ...lines].join("\n"));
