// Lints every frame with the Zeros Design engine, reports the style sources,
// and composes each frame once per theme the way the Design verification
// service does, for tools/shoot.mjs. tools/audit.sh runs both.
//
//   bun tools/check.ts [demo-repo] [out-dir] [frame-regex]
//
// ZEROS_REPO must name a Zeros checkout with its dependencies installed. The
// engine loads from there, so the findings are that checkout's findings.
// Nothing in the demo changes; output goes to out-dir (tools/out).
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const zeros = process.env.ZEROS_REPO;
if (!zeros) {
  console.error("Set ZEROS_REPO to a Zeros checkout with its dependencies installed.");
  process.exit(2);
}
const load = (file: string) => import(pathToFileURL(path.join(path.resolve(zeros), file)).href);
const engine = (file: string) => load(path.join("apps/desktop/src/engine/design", file));
const { primeDesignDirectoryName, withDesignDirectoryNameLease } = await engine("directory-registry.ts");
const { lintDesignDocument, listDesignFrames, readDesignBaseTheme, readDesignThemeNames } = await engine("document.ts");
const { createDesignContextReference, inspectDesignContext } = await engine("context.ts");
const { prepareFrameRenderSource } = await engine("render-preparation.ts");
const { readCanvas } = await engine("document-storage.ts");
const { designStyleCheckReport, readDesignStyleSources } = await engine("style-sources.ts");
const { insertDesignHeadMarkup, withDesignTheme } = await engine("source.ts");
const { DESIGN_STATIC_RENDER_CSS } = await load("packages/protocol/src/design-capture.ts");

type Violation = { severity: string; ruleId: string; file: string; line?: number; oid?: string; message: string; fix?: string };
type Host = { component: string; attributes?: Record<string, string>; failed?: boolean; ignored?: Record<string, string> };
type FileReport = { violations: Violation[]; instances?: Record<string, Host>; composeError?: string };

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.argv[2] ?? path.dirname(here));
const out = path.resolve(process.argv[3] ?? path.join(here, "out"));
const only = process.argv[4] ? new RegExp(process.argv[4]) : null;
const directory = "zeros-design-demo - Design";
const directoryId = /^id = "([^"]+)"/m.exec(await readFile(path.join(root, directory, "meta/design.toml"), "utf8"))?.[1];
if (!directoryId) throw new Error(`${directory}/meta/design.toml has no id`);
primeDesignDirectoryName(root, directory);
await mkdir(out, { recursive: true });

let failed = false;
await withDesignDirectoryNameLease(root, directory, async () => {
  const frames = (await listDesignFrames(root, { writeBack: false })) as Array<{ file: string }>;
  const themes = (await readDesignThemeNames(root)) as string[];
  const base = ((await readDesignBaseTheme(root)) as string | null) ?? themes[0]!;
  const order = [base, ...themes.filter((theme) => theme !== base)];
  const { sources, errors } = await readDesignStyleSources(root, await readCanvas(root));
  const styles = designStyleCheckReport(directory, sources, errors) as { summary: Record<string, number> };
  const report = await lintDesignDocument(root, undefined, { healOids: false, includeRuntimeAudits: false });
  const violations = (report.violations as Violation[]).filter((violation) => !only || only.test(violation.file));
  const files: Record<string, FileReport> = {};
  for (const violation of violations) (files[violation.file] ??= { violations: [] }).violations.push(violation);
  const items: Array<{ file: string; theme: string; name: string; width: number; height: number }> = [];
  for (const { file } of frames) {
    if (only && !only.test(file)) continue;
    const entry = (files[file] ??= { violations: [] });
    try {
      const reference = await createDesignContextReference(root, "demo", file, undefined, directoryId);
      const inspection = await inspectDesignContext(root, reference);
      if (inspection.status !== "ready") {
        entry.composeError = `status ${inspection.status}`;
        continue;
      }
      const state = { reference, title: inspection.title, width: inspection.width, height: inspection.height };
      const composed = await prepareFrameRenderSource(root, inspection.source, state, undefined, undefined, file);
      const hosts = composed.instances?.hosts as Map<string, Host> | Record<string, Host> | undefined;
      const hostList = hosts instanceof Map ? [...hosts] : Object.entries(hosts ?? {});
      if (hostList.length) entry.instances = Object.fromEntries(hostList);
      for (const theme of order) {
        const html = insertDesignHeadMarkup(withDesignTheme(composed.sanitized, theme), `<style>${DESIGN_STATIC_RENDER_CSS}html{color-scheme:light}</style>`);
        const name = `${file.replace(/\//g, "__").replace(/\.html$/, "")}.${theme}`;
        await writeFile(path.join(out, `${name}.html`), html);
        items.push({ file, theme, name, width: Math.ceil(inspection.width), height: Math.ceil(inspection.height) });
      }
    } catch (error) {
      entry.composeError = error instanceof Error ? error.message : String(error);
    }
  }
  await writeFile(path.join(out, "manifest.json"), JSON.stringify({ items }, null, 2) + "\n");
  await writeFile(path.join(out, "styles.json"), JSON.stringify(styles, null, 2) + "\n");
  await writeFile(path.join(out, "lint.json"), JSON.stringify({ checkedFiles: report.checkedFiles.length, themes: order, files }, null, 2) + "\n");

  const byRule = new Map<string, number>();
  for (const violation of violations) byRule.set(`${violation.severity} ${violation.ruleId}`, (byRule.get(`${violation.severity} ${violation.ruleId}`) ?? 0) + 1);
  const summary = styles.summary;
  const lines = [
    `${directory}: ${report.checkedFiles.length} files checked; themes ${order.join(", ")} (${base} is the default).`,
    `Style sources: ${summary.ready ?? 0} ready, ${summary.warning ?? 0} with a warning, ${summary.error ?? 0} with an error (${path.relative(root, path.join(out, "styles.json"))}).`,
    violations.length ? `${violations.length} lint findings:` : "No lint findings.",
    ...[...byRule].sort(([a], [b]) => a.localeCompare(b)).map(([rule, count]) => `  ${String(count).padStart(3)}  ${rule}`),
  ];
  for (const [file, entry] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
    if (!entry.violations.length && !entry.composeError) continue;
    lines.push("", file);
    for (const violation of entry.violations) lines.push(`  ${violation.line ? `line ${violation.line}` : "-"}  ${violation.severity} ${violation.ruleId}: ${violation.message}`);
    if (entry.composeError) lines.push(`  could not compose: ${entry.composeError}`);
  }
  console.log(lines.join("\n"));
  failed = violations.some((violation) => violation.severity === "error") || Object.values(files).some((entry) => entry.composeError);
});
// The engine leaves watchers open; exit once the report is written.
process.exit(failed ? 1 : 0);
