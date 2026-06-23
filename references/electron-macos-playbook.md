# Electron/macOS Playbook

Use this reference when implementing a desktop work island with Electron, especially on macOS. Adapt the route to the user's repo; do not force exact file names.

## Existing Repo First Pass

Before editing, inspect:

- `package.json` scripts and dependencies
- Electron main process entry
- preload bridge or IPC layer
- renderer entry and component structure
- existing local config/storage files
- packaging scripts, if the app is already installed

Identify:

- where the always-on-top window is created
- how collapsed/expanded state is rendered
- how collapsed quota/status data handles no-usage as `100%` and unreadable sources as neutral placeholders
- how renderer actions call native APIs
- where local JSON config belongs
- how to run the app locally

## Minimal Architecture

```text
main process
├── create island window
├── expose safe IPC handlers
├── open URLs and paths
├── write clipboard
├── read/write local config
└── optionally run confirmed scripts

preload
└── expose narrow islandApi methods

renderer
├── collapsed island entry
├── expanded module panel
├── module buttons
├── small settings/config view
└── status and feedback

local storage
├── modules.json
├── collapsed-display.json
├── variables.json
└── todos.json / stats.json
```

## Window Behavior

For a desktop island:

- use a small always-on-top window
- support compact and expanded states
- keep the island near a screen edge by default
- avoid stealing focus unless the user clicks it
- preserve drag or placement if implemented
- be careful with transparent-window resizing; repeated bounds changes can cause lag

Typical Electron settings to consider:

```js
new BrowserWindow({
  width: 96,
  height: 96,
  frame: false,
  transparent: true,
  resizable: false,
  alwaysOnTop: true,
  skipTaskbar: true,
  webPreferences: {
    preload: preloadPath,
    contextIsolation: true,
    nodeIntegration: false
  }
});
```

Adjust these to the target OS and product requirements. Do not weaken isolation just to make IPC easier.

## IPC Surface

Expose narrow methods instead of broad filesystem or shell access.

Recommended API shape:

```js
window.islandApi = {
  getModules(),
  saveModules(modules),
  openTarget(cardId),
  copyTemplate(cardId, variables),
  addTodo(text),
  getStatus(cardId),
  runScript(cardId)
};
```

IPC handlers should:

- validate card ids
- resolve actions from local config
- reject unknown permissions
- require confirmation for scripts
- return structured results for UI feedback

## MVP Implementation Order

1. Render static collapsed and expanded island.
2. Add collapsed display config with `暂无用量 -> 100%` and a neutral placeholder for unreadable quota/status data.
3. Load modules from local placeholder JSON.
4. Implement `open-url` or `open-path`.
5. Implement `copy-template`.
6. Implement todo capture or status panel.
7. Add minimal config editing only after actions work.
8. Run and test every module.

Do not start with animations, themes, AI agents, sync, or marketplace logic.

## New Project Default

If the user has no repo and asks to build a real desktop app, use:

```bash
npm create vite@latest luma-island-demo -- --template react
cd luma-island-demo
npm install
npm install --save-dev electron concurrently wait-on
```

Then add:

- an Electron main file
- a preload file
- a renderer island component
- local module config
- npm scripts for `dev`, `dev:renderer`, and `dev:electron`

If the user only needs a clickable demo, a browser-only Vite prototype is acceptable, but be explicit that it is not a true desktop island until wrapped in Electron/Tauri.

## Verification

After implementation, verify:

- app starts without terminal errors
- island appears
- compact and expanded states work
- compact state shows `100%` when Codex, Claude Code, or another quota source reports no usage
- compact state avoids `--`, `NaN`, empty arcs, and fake reset times when quota sources are unavailable
- each module performs its action
- clipboard action writes only after click
- local config survives restart when persistence is implemented
- user-provided values are not committed to source
- permissions are documented in the module table

For packaged macOS apps, source edits are not enough. If the user expects the installed app to change, rebuild/sync the installed bundle and restart it before claiming the visible app is updated.

## Safety Defaults

- Do not read clipboard by default.
- Do not run arbitrary scripts without explicit confirmation.
- Do not fetch remote data until a status card requires it.
- Do not store user-provided variables in demo fixtures.
- Do not log copied text by default.
- Do not make the island unclickable or impossible to quit.
