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

const projectRoot = path.resolve(args.project || "luma-island-app");
const displayName = args.name || "Luma Island";
const packageName = toPackageName(displayName);

if (!fs.existsSync(templateCss)) fail(`Missing template CSS: ${templateCss}`);
if (!fs.existsSync(dragHelper)) fail(`Missing drag helper: ${dragHelper}`);
if (fs.existsSync(projectRoot) && fs.readdirSync(projectRoot).length > 0 && !args.force) {
  fail(`Target directory is not empty: ${projectRoot}\nUse --force only if you intentionally want to write into it.`);
}

writeProject();
console.log(`Desktop Luma scaffold created at ${projectRoot}`);
console.log("");
console.log("Next commands:");
console.log(`  cd ${projectRoot}`);
console.log("  npm install");
console.log("  npm run dev");
console.log("");
console.log("Desktop packaging:");
console.log("  npm run package:mac");
console.log("  npm run package:win");
console.log("");
console.log("Important: npm run dev should open an Electron desktop window. A browser tab alone is not a finished Luma Island.");

function writeProject() {
  writeJson("package.json", {
    name: packageName,
    version: "0.1.0",
    private: true,
    main: "electron/main.cjs",
    scripts: {
      dev: "concurrently -k \"npm:dev:renderer\" \"npm:dev:electron\"",
      "dev:renderer": "vite --host 127.0.0.1",
      "dev:electron": "wait-on tcp:5173 && electron electron/main.cjs",
      build: "vite build",
      package: "npm run build && electron-builder",
      "package:mac": "npm run build && electron-builder --mac",
      "package:win": "npm run build && electron-builder --win"
    },
    dependencies: {
      react: "^18.3.1",
      "react-dom": "^18.3.1"
    },
    devDependencies: {
      "@vitejs/plugin-react": "^4.3.4",
      concurrently: "^9.1.2",
      electron: "^33.2.1",
      "electron-builder": "^25.1.8",
      vite: "^6.0.7",
      "wait-on": "^8.0.1"
    },
    build: {
      appId: `local.${packageName.replace(/-/g, ".")}`,
      productName: displayName,
      directories: {
        output: "release"
      },
      files: [
        "dist/**/*",
        "electron/**/*",
        "package.json"
      ],
      mac: {
        target: [
          "dir",
          "dmg"
        ]
      },
      win: {
        target: [
          "nsis",
          "portable"
        ]
      }
    }
  });

  writeText("index.html", `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(displayName)}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

  writeText("vite.config.mjs", `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true
  }
});
`);

  writeText("src/main.jsx", `import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { installLumaWindowDrag } from "./lib/luma-window-drag.js";
import "./styles.css";

const starterModules = [
  {
    id: "post",
    title: "发帖子",
    type: "open-url",
    description: "打开发文入口",
    url: "https://fawen.fun"
  },
  {
    id: "quick-links",
    title: "快捷入口",
    type: "quick-links",
    description: "新增、命名、打开常用入口"
  },
  {
    id: "copy-info",
    title: "资料复制",
    type: "copy-text",
    description: "点一下复制常用资料",
    text: ""
  }
];

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState("home");
  const [modules, setModules] = useState(starterModules);
  const [quickLinks, setQuickLinks] = useState([]);
  const [draftLink, setDraftLink] = useState({ title: "", url: "" });
  const [copyText, setCopyText] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const root = document.querySelector(".luma-stage");
    return installLumaWindowDrag(root);
  }, []);

  useEffect(() => {
    window.islandApi?.getModules?.().then((saved) => {
      if (Array.isArray(saved) && saved.length > 0) setModules(saved);
    });
    window.islandApi?.getQuickLinks?.().then((saved) => {
      if (Array.isArray(saved)) setQuickLinks(saved);
    });
  }, []);

  const copyModule = useMemo(() => modules.find((module) => module.type === "copy-text"), [modules]);

  useEffect(() => {
    setCopyText(copyModule?.text || "");
  }, [copyModule?.id, copyModule?.text]);

  function notify(message) {
    setToast(message);
    window.clearTimeout(window.__lumaToastTimer);
    window.__lumaToastTimer = window.setTimeout(() => setToast(""), 1800);
  }

  async function saveModules(nextModules) {
    setModules(nextModules);
    await window.islandApi?.saveModules?.(nextModules);
  }

  async function saveQuickLinks(nextLinks) {
    setQuickLinks(nextLinks);
    await window.islandApi?.saveQuickLinks?.(nextLinks);
  }

  async function handleModule(module) {
    if (module.type === "open-url") {
      await window.islandApi?.openUrl?.(module.url);
      notify("已打开");
      return;
    }

    if (module.type === "quick-links") {
      setCollapsed(false);
      setActivePanel("quick-links");
      return;
    }

    if (module.type === "copy-text") {
      setCollapsed(false);
      setActivePanel("copy");
    }
  }

  async function addQuickLink(event) {
    event.preventDefault();
    if (!draftLink.title.trim() || !draftLink.url.trim()) return;
    const nextLinks = [...quickLinks, { id: crypto.randomUUID(), title: draftLink.title.trim(), url: draftLink.url.trim() }];
    await saveQuickLinks(nextLinks);
    setDraftLink({ title: "", url: "" });
    notify("已保存入口");
  }

  async function saveCopyText(event) {
    event.preventDefault();
    const nextModules = modules.map((module) => (
      module.type === "copy-text" ? { ...module, text: copyText } : module
    ));
    await saveModules(nextModules);
    notify("已保存内容");
  }

  async function copyCurrentText() {
    if (!copyText.trim()) {
      notify("先编辑内容");
      return;
    }
    await window.islandApi?.copyText?.(copyText);
    notify("已复制");
  }

  return (
    <main className={\`luma-stage luma-theme-taiji \${collapsed ? "is-collapsed" : ""}\`}>
      <section className="luma-dock" aria-label="${escapeAttr(displayName)}">
        <button className="luma-collapsed-trigger" type="button" onClick={() => setCollapsed(false)} aria-label="展开光岛">
          <span className="luma-orb-value">100%</span>
        </button>

        <button className="luma-orb luma-no-drag" type="button" onClick={() => setCollapsed((value) => !value)}>
          <span>光岛</span>
        </button>

        <div className="luma-module-list">
          {modules.map((module) => (
            <button className="luma-module-button luma-no-drag" key={module.id} type="button" onClick={() => handleModule(module)}>
              <span className="luma-module-icon">{module.title.slice(0, 1)}</span>
              <span className="luma-module-copy">
                <strong>{module.title}</strong>
                <small>{module.description}</small>
              </span>
            </button>
          ))}
        </div>

        <div className="luma-tools">
          <button className="luma-icon-button luma-no-drag" type="button" onClick={() => setCollapsed(true)} aria-label="收起">-</button>
        </div>
      </section>

      <section className="luma-panel is-open">
        {activePanel === "home" && (
          <>
            <header className="luma-panel-header">
              <span className="luma-eyebrow">桌面应用</span>
              <h1>{displayName}</h1>
              <p>点左侧按钮开始任务。这个窗口是 Electron 桌面壳，不是网页。</p>
            </header>
            <div className="luma-card">
              <strong>下一步</strong>
              <p>把资料复制、常用回复、状态面板换成你的真实内容。</p>
            </div>
          </>
        )}

        {activePanel === "quick-links" && (
          <>
            <header className="luma-panel-header">
              <span className="luma-eyebrow">快捷入口</span>
              <h1>新增入口</h1>
              <p>先命名，再打开。不要让按钮自动跳到随机网址。</p>
            </header>
            <form className="luma-form" onSubmit={addQuickLink}>
              <input className="luma-input luma-no-drag" placeholder="名字，比如：项目后台" value={draftLink.title} onChange={(event) => setDraftLink({ ...draftLink, title: event.target.value })} />
              <input className="luma-input luma-no-drag" placeholder="地址，比如：https://example.com" value={draftLink.url} onChange={(event) => setDraftLink({ ...draftLink, url: event.target.value })} />
              <button className="luma-primary-button luma-no-drag" type="submit">添加入口</button>
            </form>
            <div className="luma-list">
              {quickLinks.map((entry) => (
                <button className="luma-list-row luma-no-drag" key={entry.id} type="button" onClick={() => window.islandApi?.openUrl?.(entry.url)}>
                  <span>{entry.title}</span>
                  <small>{entry.url}</small>
                </button>
              ))}
              {quickLinks.length === 0 && <p className="luma-empty">还没有入口，先添加一个。</p>}
            </div>
          </>
        )}

        {activePanel === "copy" && (
          <>
            <header className="luma-panel-header">
              <span className="luma-eyebrow">资料复制</span>
              <h1>编辑内容</h1>
              <p>这个模块不能只放占位。填好后再复制。</p>
            </header>
            <form className="luma-form" onSubmit={saveCopyText}>
              <textarea className="luma-textarea luma-no-drag" placeholder="这里填你要复制的资料" value={copyText} onChange={(event) => setCopyText(event.target.value)} />
              <div className="luma-button-row">
                <button className="luma-secondary-button luma-no-drag" type="submit">保存内容</button>
                <button className="luma-primary-button luma-no-drag" type="button" onClick={copyCurrentText}>复制</button>
              </div>
            </form>
          </>
        )}
      </section>

      {toast && <div className="luma-toast">{toast}</div>}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
`);

  writeText("src/styles.css", `@import "./luma-default.css";

html,
body,
#root {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.luma-panel-header {
  position: relative;
  z-index: 1;
  margin-bottom: 12px;
}

.luma-panel-header h1 {
  margin: 4px 0 6px;
  color: var(--luma-text);
  font-size: 18px;
  line-height: 1.1;
}

.luma-panel-header p,
.luma-card p {
  margin: 0;
  color: var(--luma-muted);
  font-size: 12px;
  line-height: 1.45;
}

.luma-eyebrow {
  color: var(--luma-accent-2);
  font-size: 10px;
  font-weight: 800;
}

.luma-form,
.luma-list,
.luma-button-row {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 8px;
}

.luma-input {
  min-height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.07);
  color: var(--luma-text);
  outline: none;
}

.luma-button-row {
  grid-template-columns: 1fr 1fr;
}

.luma-primary-button,
.luma-secondary-button,
.luma-list-row {
  min-height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 0 12px;
  color: var(--luma-text);
  font-weight: 800;
}

.luma-primary-button {
  background: linear-gradient(135deg, rgba(76, 222, 128, 0.88), rgba(72, 191, 227, 0.78));
}

.luma-secondary-button,
.luma-list-row {
  background: rgba(255, 255, 255, 0.08);
}

.luma-list-row {
  display: grid;
  justify-items: start;
  text-align: left;
}

.luma-list-row small {
  max-width: 100%;
  overflow: hidden;
  color: var(--luma-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}
`);

  writeText("src/luma-default.css", fs.readFileSync(templateCss, "utf8"));
  writeText("src/lib/luma-window-drag.js", fs.readFileSync(dragHelper, "utf8"));
  writeText("electron/main.cjs", mainProcessSource());
  writeText("electron/preload.cjs", preloadSource());
  writeText(".gitignore", `node_modules
dist
release
.DS_Store
*.log
`);
  writeText("README.md", `# ${displayName}

This is a desktop Luma Island scaffold generated by $luma-island-builder.

It must run as an Electron desktop app. A browser tab or localhost page alone is only a renderer test.

## Run

\`\`\`bash
npm install
npm run dev
\`\`\`

## Package

\`\`\`bash
npm run package:mac
npm run package:win
\`\`\`
`);
}

function mainProcessSource() {
  return `const { app, BrowserWindow, clipboard, ipcMain, shell } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");

let islandWindow;

function dataFile(name) {
  return path.join(app.getPath("userData"), name);
}

async function readJson(name, fallback) {
  try {
    return JSON.parse(await fs.readFile(dataFile(name), "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(name, value) {
  await fs.mkdir(app.getPath("userData"), { recursive: true });
  await fs.writeFile(dataFile(name), JSON.stringify(value, null, 2));
  return true;
}

function createWindow() {
  islandWindow = new BrowserWindow({
    width: 430,
    height: 620,
    minWidth: 96,
    minHeight: 96,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (app.isPackaged) {
    islandWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  } else {
    islandWindow.loadURL("http://127.0.0.1:5173");
  }
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle("luma:get-bounds", () => islandWindow.getBounds());
ipcMain.handle("luma:set-position", (_event, x, y) => {
  islandWindow.setPosition(Math.round(x), Math.round(y), false);
  return islandWindow.getBounds();
});
ipcMain.handle("luma:open-url", async (_event, url) => {
  if (!/^https?:\\/\\//i.test(url)) throw new Error("Only http and https URLs are enabled in the starter app.");
  await shell.openExternal(url);
  return true;
});
ipcMain.handle("luma:copy-text", (_event, text) => {
  clipboard.writeText(String(text || ""));
  return true;
});
ipcMain.handle("luma:get-modules", () => readJson("modules.json", []));
ipcMain.handle("luma:save-modules", (_event, modules) => writeJson("modules.json", modules));
ipcMain.handle("luma:get-quick-links", () => readJson("quick-links.json", []));
ipcMain.handle("luma:save-quick-links", (_event, links) => writeJson("quick-links.json", links));
`;
}

function preloadSource() {
  return `const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lumaWindow", {
  getBounds: () => ipcRenderer.invoke("luma:get-bounds"),
  setPosition: (x, y) => ipcRenderer.invoke("luma:set-position", x, y)
});

contextBridge.exposeInMainWorld("islandApi", {
  openUrl: (url) => ipcRenderer.invoke("luma:open-url", url),
  copyText: (text) => ipcRenderer.invoke("luma:copy-text", text),
  getModules: () => ipcRenderer.invoke("luma:get-modules"),
  saveModules: (modules) => ipcRenderer.invoke("luma:save-modules", modules),
  getQuickLinks: () => ipcRenderer.invoke("luma:get-quick-links"),
  saveQuickLinks: (links) => ipcRenderer.invoke("luma:save-quick-links", links)
});
`;
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--force") {
      parsed.force = true;
      continue;
    }
    if (arg === "--project" || arg === "--name") {
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

function writeJson(relativePath, data) {
  writeText(relativePath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relativePath, text) {
  const target = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

function toPackageName(value) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "luma-island-app";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function printHelp() {
  console.log(`Usage:
  node scripts/create-electron-luma.mjs --project /path/to/new-app --name "工作光岛"

Options:
  --project <path>  Target project directory. Defaults to ./luma-island-app.
  --name <name>     App display name. Defaults to "Luma Island".
  --force           Allow writing into a non-empty directory.
  --help            Show this help.

This creates an Electron desktop app scaffold. It is not a browser-only prototype.
`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
