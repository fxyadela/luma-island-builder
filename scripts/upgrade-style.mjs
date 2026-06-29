#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, "..");
const templateCss = path.join(skillRoot, "templates", "default-luma-island.css");
const dragHelper = path.join(skillRoot, "templates", "luma-window-drag.js");

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const projectRoot = path.resolve(args.project || process.cwd());
const dryRun = Boolean(args["dry-run"]);
const includeDrag = Boolean(args["include-drag"]);
const changes = [];
const warnings = [];

if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
  fail(`Project path does not exist or is not a directory: ${projectRoot}`);
}

if (!fs.existsSync(templateCss)) {
  fail(`Missing template CSS: ${templateCss}`);
}

const cssTarget = args.css
  ? path.resolve(projectRoot, args.css)
  : findCssTarget(projectRoot);

const cssDir = path.dirname(cssTarget);
const installedCss = path.join(cssDir, "luma-default.css");
const importLine = '@import "./luma-default.css";';

ensureDir(cssDir);
copyIfChanged(templateCss, installedCss, "default CSS template");
ensureCssImport(cssTarget, importLine);

if (includeDrag) {
  const dragTarget = path.join(projectRoot, "src", "lib", "luma-window-drag.js");
  ensureDir(path.dirname(dragTarget));
  copyIfChanged(dragHelper, dragTarget, "drag helper");
  warnings.push("Drag helper copied only. Wire it into the renderer manually or ask Codex to apply the drag migration.");
}

if (!projectUsesLumaClasses(projectRoot)) {
  warnings.push("Could not find .shortcut-stage or .liquid-dock in project source. The CSS was installed, but it may not apply until the UI uses the desktop template class names.");
}

if (changes.length === 0) {
  console.log("No style upgrade needed. The CSS import and template file are already in place.");
} else {
  console.log(dryRun ? "Dry run complete. Planned changes:" : "Style upgrade complete. Changes:");
  for (const change of changes) console.log(`- ${change}`);
}

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

console.log("\nWhat this did not touch:");
console.log("- module config");
console.log("- saved links");
console.log("- local variables");
console.log("- user data JSON files");

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--dry-run") {
      parsed["dry-run"] = true;
      continue;
    }
    if (arg === "--include-drag") {
      parsed["include-drag"] = true;
      continue;
    }
    if (arg === "--project" || arg === "--css") {
      const value = argv[i + 1];
      if (!value) fail(`Missing value for ${arg}`);
      parsed[arg.slice(2)] = value;
      i += 1;
      continue;
    }
    fail(`Unknown argument: ${arg}`);
  }
  return parsed;
}

function printHelp() {
  console.log(`Usage:
  node scripts/upgrade-style.mjs --project /path/to/luma-project

Options:
  --project <path>   Existing Luma Island project. Defaults to current directory.
  --css <path>       CSS entry file relative to project root. Auto-detected by default.
  --include-drag     Also copy templates/luma-window-drag.js into src/lib/.
  --dry-run          Show planned changes without writing files.
  --help             Show this help.

This upgrades style assets only. It does not modify module config, saved links, variables, or user data.
`);
}

function findCssTarget(root) {
  const candidates = [
    "src/styles.css",
    "src/index.css",
    "src/App.css",
    "app/globals.css",
    "styles/globals.css",
    "styles.css"
  ];

  for (const candidate of candidates) {
    const full = path.join(root, candidate);
    if (fs.existsSync(full)) return full;
  }

  const fallback = path.join(root, "src", "styles.css");
  warnings.push("No common CSS entry file found. Creating src/styles.css; make sure the app imports it.");
  return fallback;
}

function ensureDir(dir) {
  if (fs.existsSync(dir)) return;
  if (!dryRun) fs.mkdirSync(dir, { recursive: true });
  changes.push(`create directory ${relative(dir)}`);
}

function copyIfChanged(source, target, label) {
  const sourceText = fs.readFileSync(source, "utf8");
  const targetExists = fs.existsSync(target);
  const targetText = targetExists ? fs.readFileSync(target, "utf8") : "";

  if (targetExists && targetText === sourceText) return;

  if (targetExists) backupFile(target);
  if (!dryRun) fs.writeFileSync(target, sourceText);
  changes.push(`${targetExists ? "update" : "install"} ${label} at ${relative(target)}`);
}

function ensureCssImport(target, line) {
  const exists = fs.existsSync(target);
  const text = exists ? fs.readFileSync(target, "utf8") : "";

  if (text.includes(line) || text.includes("luma-default.css")) return;

  if (exists) backupFile(target);
  const next = `${line}\n${text}`;
  if (!dryRun) fs.writeFileSync(target, next);
  changes.push(`${exists ? "prepend" : "create"} CSS import in ${relative(target)}`);
}

function backupFile(file) {
  const backup = `${file}.bak-${timestamp()}`;
  if (!dryRun) fs.copyFileSync(file, backup);
  changes.push(`backup ${relative(file)} to ${relative(backup)}`);
}

function projectUsesLumaClasses(root) {
  const sourceRoot = path.join(root, "src");
  if (!fs.existsSync(sourceRoot)) return false;

  const files = [];
  collectFiles(sourceRoot, files);
  return files.some((file) => {
    if (!/\.(jsx?|tsx?|html|css)$/.test(file)) return false;
    const text = fs.readFileSync(file, "utf8");
    return text.includes("shortcut-stage") || text.includes("liquid-dock");
  });
}

function collectFiles(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, files);
    if (entry.isFile()) files.push(full);
  }
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "-");
}

function relative(file) {
  return path.relative(projectRoot, file) || ".";
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
