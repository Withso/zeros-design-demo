// Screenshots each frame tools/check.ts composed, at its canvas size, and
// runs the frame runtime's three audits on it: contrast, overflow and the 4px
// spacing scale. auditPage follows auditWarnings in the Zeros file
// packages/protocol/src/design-runtime.ts, colour parsing (colorFromCss)
// included, so its results match what Validate reports for a frame the
// canvas has drawn.
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
  function composedParentOf(node) {
    if (!node) return null;
    if (node.assignedSlot) return node.assignedSlot;
    if (node.parentElement) return node.parentElement;
    var parent = node.parentNode;
    return parent && parent.nodeType === 11 && parent.host ? parent.host : null;
  }
  function hiddenBy(element) {
    var invisibleSelf = false;
    for (var current = element; current && current instanceof Element; current = composedParentOf(current)) {
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
  var parsedColors = new Map();
  function parsedColor(value) {
    var text = String(value || "").trim().toLowerCase();
    if (parsedColors.has(text)) return parsedColors.get(text);
    var color = colorFromCss(text);
    if (parsedColors.size >= 512) parsedColors.clear();
    parsedColors.set(text, color);
    return color;
  }
  function multiply(matrix, vector) {
    return matrix.map(function (row) { return row[0] * vector[0] + row[1] * vector[1] + row[2] * vector[2]; });
  }
  var XYZ_TO_LINEAR_SRGB = [[3.2409699419045226, -1.537383177570094, -0.4986107602930034], [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559], [0.05563007969699366, -0.20397695888897652, 1.0569715142428786]];
  var D50_TO_D65 = [[0.9554734527042182, -0.023098536874261423, 0.0632593086610217], [-0.028369706963208136, 1.0099954580058226, 0.021041398966943008], [0.012314001688319899, -0.020507696433477912, 1.3303659366080753]];
  var RGB_SPACES = {
    "display-p3": { matrix: [[0.4865709486482162, 0.26566769316909306, 0.1982172852343625], [0.2289745640697488, 0.6917385218365064, 0.079286914093745], [0, 0.04511338185890264, 1.043944368900976]], linear: srgbLinear },
    rec2020: { matrix: [[0.6369580483012914, 0.14461690358620832, 0.1688809751641721], [0.2627002120112671, 0.6779980715188708, 0.05930171646986196], [0, 0.028072693049087428, 1.060985057710791]], linear: function (value) {
      var sign = value < 0 ? -1 : 1, magnitude = Math.abs(value);
      return sign * (magnitude < 0.018053968510807 * 4.5 ? magnitude / 4.5 : Math.pow((magnitude + 0.09929682680944) / 1.09929682680944, 1 / 0.45));
    } },
    "a98-rgb": { matrix: [[0.5766690429101305, 0.1855582379065463, 0.1882286462349947], [0.29734497525053605, 0.6273635662554661, 0.07529145849399788], [0.02703136138641234, 0.07068885253582723, 0.9913375368376388]], linear: function (value) {
      return (value < 0 ? -1 : 1) * Math.pow(Math.abs(value), 563 / 256);
    } },
    "prophoto-rgb": { d50: true, matrix: [[0.7977604896723027, 0.13518583717574031, 0.0313493495815248], [0.2880711282292934, 0.7118432178101014, 0.00008565396060525902], [0, 0, 0.8251046025104601]], linear: function (value) {
      var magnitude = Math.abs(value);
      return (value < 0 ? -1 : 1) * (magnitude <= 16 / 512 ? magnitude / 16 : Math.pow(magnitude, 1.8));
    } }
  };
  function srgbLinear(value) {
    var sign = value < 0 ? -1 : 1, magnitude = Math.abs(value);
    return sign * (magnitude <= 0.04045 ? magnitude / 12.92 : Math.pow((magnitude + 0.055) / 1.055, 2.4));
  }
  function srgbEncoded(value) {
    var magnitude = Math.abs(value);
    var encoded = magnitude <= 0.0031308 ? magnitude * 12.92 : 1.055 * Math.pow(magnitude, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(1, (value < 0 ? -1 : 1) * encoded));
  }
  function labToXyzD50(lightness, a, b) {
    var kappa = 24389 / 27, epsilon = 216 / 24389;
    var f1 = (lightness + 16) / 116, f0 = a / 500 + f1, f2 = f1 - b / 200;
    var x = Math.pow(f0, 3) > epsilon ? Math.pow(f0, 3) : (116 * f0 - 16) / kappa;
    var y = lightness > kappa * epsilon ? Math.pow(f1, 3) : lightness / kappa;
    var z = Math.pow(f2, 3) > epsilon ? Math.pow(f2, 3) : (116 * f2 - 16) / kappa;
    return [x * 0.9642956764295677, y, z * 0.8251046025104602];
  }
  function oklabToLinearSrgb(lightness, a, b) {
    var l = Math.pow(lightness + 0.3963377774 * a + 0.2158037573 * b, 3);
    var m = Math.pow(lightness - 0.1055613458 * a - 0.0638541728 * b, 3);
    var s = Math.pow(lightness - 0.0894841775 * a - 1.291485548 * b, 3);
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
    ];
  }
  // Computed colours keep their space: rgb() for sRGB; oklch(), oklab(),
  // lab(), lch() or color() otherwise. Each becomes gamma-encoded sRGB, so a
  // colour outside sRGB is measured as the display clips it. An unreadable
  // colour returns null and is not audited.
  function colorFromCss(text) {
    var match = /^([a-z0-9-]+)\(([^()]*)\)$/.exec(text);
    if (!match) return null;
    var name = match[1];
    var halves = match[2].split("/");
    var channels = halves[0].trim().split(/[\s,]+/).filter(Boolean);
    var space = name;
    if (name === "color") space = channels.shift() || "";
    var alphaToken = halves.length > 1 ? halves[1].trim() : (name === "rgb" || name === "rgba") && channels.length === 4 ? channels.pop() : "1";
    if (channels.length !== 3) return null;
    function channel(token, percent) {
      if (token === "none") return 0;
      var number = parseFloat(token);
      return token.slice(-1) === "%" ? number / 100 * percent : number;
    }
    var alpha = channel(alphaToken, 1);
    var c;
    if (space === "rgb" || space === "rgba") c = [channel(channels[0], 255) / 255, channel(channels[1], 255) / 255, channel(channels[2], 255) / 255];
    else if (space === "srgb") c = [channel(channels[0], 1), channel(channels[1], 1), channel(channels[2], 1)];
    else {
      var linear;
      if (space === "srgb-linear") linear = [channel(channels[0], 1), channel(channels[1], 1), channel(channels[2], 1)];
      else if (space === "oklab" || space === "oklch") {
        var okLightness = channel(channels[0], 1), okA = channel(channels[1], 0.4), okB = channel(channels[2], 0.4);
        if (space === "oklch") {
          var okHue = parseFloat(channels[2]) * Math.PI / 180 || 0;
          okA = channel(channels[1], 0.4) * Math.cos(okHue);
          okB = channel(channels[1], 0.4) * Math.sin(okHue);
        }
        linear = oklabToLinearSrgb(okLightness, okA, okB);
      } else if (space === "lab" || space === "lch") {
        var labLightness = channel(channels[0], 100), labA = channel(channels[1], 125), labB = channel(channels[2], 125);
        if (space === "lch") {
          var labHue = parseFloat(channels[2]) * Math.PI / 180 || 0;
          labA = channel(channels[1], 150) * Math.cos(labHue);
          labB = channel(channels[1], 150) * Math.sin(labHue);
        }
        linear = multiply(XYZ_TO_LINEAR_SRGB, multiply(D50_TO_D65, labToXyzD50(labLightness, labA, labB)));
      } else if (space === "xyz" || space === "xyz-d65" || space === "xyz-d50") {
        var xyz = [channel(channels[0], 1), channel(channels[1], 1), channel(channels[2], 1)];
        linear = multiply(XYZ_TO_LINEAR_SRGB, space === "xyz-d50" ? multiply(D50_TO_D65, xyz) : xyz);
      } else if (RGB_SPACES[space]) {
        var definition = RGB_SPACES[space];
        var toXyz = multiply(definition.matrix, [channel(channels[0], 1), channel(channels[1], 1), channel(channels[2], 1)].map(definition.linear));
        linear = multiply(XYZ_TO_LINEAR_SRGB, definition.d50 ? multiply(D50_TO_D65, toXyz) : toXyz);
      } else return null;
      c = linear.map(srgbEncoded);
    }
    if (c.some(function (value) { return !isFinite(value); }) || !isFinite(alpha)) return null;
    return {
      r: Math.max(0, Math.min(1, c[0])),
      g: Math.max(0, Math.min(1, c[1])),
      b: Math.max(0, Math.min(1, c[2])),
      a: Math.max(0, Math.min(1, alpha))
    };
  }
  function composite(f, b) {
    var a = f.a + b.a * (1 - f.a);
    if (a <= 0) return { r: 1, g: 1, b: 1, a: 1 };
    return { r: (f.r * f.a + b.r * b.a * (1 - f.a)) / a, g: (f.g * f.a + b.g * b.a * (1 - f.a)) / a, b: (f.b * f.a + b.b * b.a * (1 - f.a)) / a, a: a };
  }
  function backgroundColorOf(element) {
    var layers = [];
    for (var current = element; current && current instanceof Element; current = composedParentOf(current)) {
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
    // An ellipsis or a line clamp cuts text off on purpose.
    var ellipsis = computed.textOverflow === "ellipsis" && computed.overflowX !== "visible";
    var clamped = !!computed.webkitLineClamp && computed.webkitLineClamp !== "none" && computed.overflowY !== "visible";
    if ((!ellipsis && element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1) ||
      (!clamped && element.clientHeight > 0 && element.scrollHeight > element.clientHeight + 1)) {
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
