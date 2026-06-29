#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, "..");
const templateCss = path.join(skillRoot, "templates", "default-luma-island.css");
const dragHelper = path.join(skillRoot, "templates", "luma-window-drag.js");
const prototypeAssets = path.join(skillRoot, "assets", "prototypes");
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
if (!fs.existsSync(prototypeAssets)) fail(`Missing prototype assets: ${prototypeAssets}`);
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
import psychicLogo from "./assets/prototypes/psychic/idle.png";
import signalLogo from "./assets/prototypes/signal/idle.png";
import campLogo from "./assets/prototypes/camp/idle.png";
import slingLogo from "./assets/prototypes/sling/idle.png";
import shadowLogo from "./assets/prototypes/shadow/idle.png";
import skaterLogo from "./assets/prototypes/skater/idle.png";
import callerLogo from "./assets/prototypes/caller/idle.png";
import marshalLogo from "./assets/prototypes/marshal/idle.png";
import "./styles.css";

const dailyLogos = [psychicLogo, signalLogo, campLogo, slingLogo, shadowLogo, skaterLogo, callerLogo, marshalLogo];
const dockThemes = ["taiji", "fridge", "capsule"];

const starterModules = [
  {
    id: "post",
    title: "发帖子",
    type: "open-url",
    description: "打开发文入口",
    icon: "发",
    url: "https://fawen.fun"
  },
  {
    id: "quick-links",
    title: "快捷入口",
    type: "quick-links",
    description: "新增、命名、打开常用入口",
    icon: "入"
  },
  {
    id: "copy-info",
    title: "资料复制",
    type: "copy-text",
    description: "点一下复制常用资料",
    icon: "复",
    text: ""
  }
];

function getDailyLogo() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / 86400000);
  return dailyLogos[day % dailyLogos.length];
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState("home");
  const [modules, setModules] = useState(starterModules);
  const [quickLinks, setQuickLinks] = useState([]);
  const [draftLink, setDraftLink] = useState({ title: "", url: "" });
  const [copyText, setCopyText] = useState("");
  const [toast, setToast] = useState("");
  const [dockTheme, setDockTheme] = useState("taiji");

  useEffect(() => {
    const root = document.querySelector(".shortcut-stage");
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

  function cycleDockTheme() {
    setDockTheme((current) => dockThemes[(dockThemes.indexOf(current) + 1) % dockThemes.length]);
  }

  const panelTitle = activePanel === "quick-links" ? "快捷入口" : activePanel === "copy" ? "资料复制" : displayName;
  const panelHint = activePanel === "quick-links"
    ? "新增、命名，再打开具体入口"
    : activePanel === "copy"
      ? "先编辑内容，再一键复制"
      : "桌面端入口已打开，不是网页预览";
  const dailyLogo = getDailyLogo();

  return (
    <main className={\`shortcut-stage \${collapsed ? "collapsed" : "expanded"} theme-\${dockTheme} \${!collapsed ? "panel-open" : ""}\`}>
      <section className="liquid-dock" aria-label="${escapeAttr(displayName)}快捷栏">
        <div className="collapsed-quota-rail" aria-label="${escapeAttr(displayName)}入口">
          <button
            className="collapsed-center has-quota"
            type="button"
            aria-label="展开光岛"
            onClick={() => setCollapsed(false)}
            title="Claude Code 100%，Codex 100%"
          >
            <svg className="quota-taiji" viewBox="0 0 72 72" aria-hidden="true">
              <path className="quota-track quota-track-claude" d="M36 5 A31 31 0 0 0 36 67" pathLength="100" />
              <path className="quota-track quota-track-codex" d="M36 67 A31 31 0 0 0 36 5" pathLength="100" />
              <path className="quota-progress quota-progress-claude" d="M36 5 A31 31 0 0 0 36 67" pathLength="100" style={{ strokeDasharray: "100 100" }} />
              <path className="quota-progress quota-progress-codex" d="M36 67 A31 31 0 0 0 36 5" pathLength="100" style={{ strokeDasharray: "100 100" }} />
            </svg>
            <span className="taiji-core" aria-hidden="true">
              <span className="taiji-side claude-side" title="Claude Code">
                <strong>100%</strong>
                <small>CC</small>
              </span>
              <span className="taiji-divider" />
              <span className="taiji-side codex-side" title="Codex">
                <strong>100%</strong>
                <small>Codex</small>
              </span>
            </span>
          </button>
        </div>

        <button className="dock-orb" type="button" onClick={cycleDockTheme} title="切换收起样式">
          <img src={dailyLogo} alt="" />
        </button>

        <div className="shortcut-list">
          {modules.map((module) => (
            <button className="shortcut-button" key={module.id} type="button" onClick={() => handleModule(module)} title={module.description}>
              <span className="shortcut-icon">{module.icon || module.title.slice(0, 1)}</span>
              <span className="shortcut-copy">
                <strong>{module.title}</strong>
                <small>{module.description}</small>
              </span>
            </button>
          ))}
        </div>

        <div className="dock-tools">
          <button className="round-tool collapse" type="button" onClick={() => setCollapsed(true)} title="收起到右侧">›</button>
        </div>
      </section>

      <aside className={\`info-panel \${!collapsed ? "show" : ""}\`}>
        <div className="panel-head">
          <div>
            <strong>{panelTitle}</strong>
            <span>{panelHint}</span>
          </div>
          <div className="panel-head-tools">
            <button className="panel-close" type="button" onClick={() => setCollapsed(true)} aria-label="关闭">×</button>
          </div>
        </div>

        {activePanel === "home" && (
          <div className="info-copy-panel">
            <button className="wide-action" type="button" onClick={() => setActivePanel("quick-links")}>
              <span className="shortcut-icon">入</span>
              <span>
                <strong>快捷入口</strong>
                <small>新增链接，命名后再打开</small>
              </span>
            </button>
            <button className="wide-action" type="button" onClick={() => setActivePanel("copy")}>
              <span className="shortcut-icon">复</span>
              <span>
                <strong>资料复制</strong>
                <small>先编辑你的真实内容</small>
              </span>
            </button>
            <div className="info-quote-section">
              <div className="info-section-head">
                <strong>桌面应用已就绪</strong>
                <small>这套外壳复用当前桌面端样式，仅模块内容不同。</small>
              </div>
            </div>
          </div>
        )}

        {activePanel === "quick-links" && (
          <div className="jump-panel">
            <div className="jump-list">
              {quickLinks.map((entry) => (
                <div className="jump-item" key={entry.id}>
                  <button className="jump-open-button" type="button" onClick={() => window.islandApi?.openUrl?.(entry.url)}>
                    <span>
                      <strong>{entry.title}</strong>
                      <small>{entry.url}</small>
                    </span>
                  </button>
                </div>
              ))}
              {quickLinks.length === 0 && <div className="jump-add-box">还没有入口，先添加一个。</div>}
            </div>
            <form className="jump-add-box" onSubmit={addQuickLink}>
              <label>
                <span>名字</span>
                <input placeholder="比如：项目后台" value={draftLink.title} onChange={(event) => setDraftLink({ ...draftLink, title: event.target.value })} />
              </label>
              <label>
                <span>地址</span>
                <input placeholder="比如：https://example.com" value={draftLink.url} onChange={(event) => setDraftLink({ ...draftLink, url: event.target.value })} />
              </label>
              <button className="wide-action" type="submit">
                <span className="shortcut-icon">+</span>
                <span>
                  <strong>添加入口</strong>
                  <small>保存后从列表里打开</small>
                </span>
              </button>
            </form>
          </div>
        )}

        {activePanel === "copy" && (
          <form className="info-copy-panel" onSubmit={saveCopyText}>
            <section className="info-quote-section">
              <div className="info-section-head">
                <strong>编辑内容</strong>
                <small>这个模块不能只放占位，填好后再复制。</small>
              </div>
              <label className="quote-block">
                <span>要复制的正文</span>
                <textarea placeholder="这里填你要复制的资料" value={copyText} onChange={(event) => setCopyText(event.target.value)} />
              </label>
              <div className="panel-actions">
                <button type="submit">保存内容</button>
                <button type="button" onClick={copyCurrentText}>复制</button>
              </div>
            </section>
          </form>
        )}
      </aside>

      <div className={\`shortcut-toast \${toast ? "show" : ""}\`}>{toast}</div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
`);

  writeText("src/styles.css", `@import "./luma-default.css";
`);

  writeText("src/luma-default.css", fs.readFileSync(templateCss, "utf8"));
  writeText("src/lib/luma-window-drag.js", fs.readFileSync(dragHelper, "utf8"));
  copyDir(prototypeAssets, path.join(projectRoot, "src", "assets", "prototypes"));
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

function copyDir(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
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
