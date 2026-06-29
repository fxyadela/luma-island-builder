# Electron Desktop Playbook

Use this reference when implementing a desktop work island with Electron on macOS, Windows, or Linux. Adapt the route to the user's repo and operating system; do not force exact file names or one operating system's packaging flow.

Hard rule: a Luma Island is not complete if it only runs as a web page, localhost tab, static HTML file, or browser-only Vite app. Vite may be used as the renderer, but the user-facing result must run inside Electron, Tauri, or another native desktop shell.

## Existing Repo First Pass

Before editing, inspect:

- `package.json` scripts and dependencies
- Electron main process entry
- preload bridge or IPC layer
- renderer entry and component structure
- existing local config/storage files
- packaging scripts, if the app is already installed

If the repo has only a web renderer and no desktop shell, add the desktop shell before claiming the island exists. A browser preview is only a renderer test.

Identify:

- where the always-on-top window is created
- how collapsed/expanded state is rendered
- how collapsed quota/status data handles no-usage as `100%` and unreadable sources as neutral placeholders
- how renderer actions call native APIs
- where local JSON config belongs
- how to run the app locally

## Minimal Architecture

```text
desktop shell / main process
├── create island window
├── expose safe IPC handlers
├── expose narrow window-position handlers for pointer dragging
├── open URLs and paths
├── write clipboard
├── read/write local config
├── optionally run confirmed scripts
└── support packaged app paths and user data paths

preload
└── expose narrow islandApi methods

renderer
├── collapsed island entry
├── expanded module panel
├── module buttons
├── quick-link manager panel
├── small settings/config view
├── status and feedback
└── renderer stylesheet copied from templates/default-luma-island.css

local storage
├── modules.json
├── collapsed-display.json
├── variables.json
├── quick-links.json
├── todos.json / stats.json
└── user-provided copy/templates/prompts
```

## Window Behavior

For a desktop island:

- use a small always-on-top window
- support compact and expanded states
- keep the island near a screen edge by default
- avoid stealing focus unless the user clicks it
- preserve drag or placement if implemented
- support dragging from the dock, panel, collapsed trigger, and module buttons without breaking normal click actions
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

## Default Renderer Style

For a new project, copy `templates/default-luma-island.css` into the renderer stylesheet before implementing custom UI. Also copy `assets/prototypes/` into `src/assets/prototypes/` for the dock orb. The default shell must match the current desktop app structure:

```text
.shortcut-stage[.expanded|.collapsed][.theme-taiji|.theme-fridge|.theme-capsule]
├── .liquid-dock
│   ├── .collapsed-quota-rail
│   │   └── .collapsed-center
│   ├── .dock-orb
│   │   └── img
│   ├── .shortcut-list
│   │   └── .shortcut-button
│   └── .dock-tools
└── .info-panel[.show]
```

Use `.collapsed` or `.expanded` on `.shortcut-stage`. Add one theme class to the same root node:

- `.theme-taiji`
- `.theme-fridge`
- `.theme-capsule`

For existing repos, do not blindly replace the user's stylesheet. If the repo has no strong design system, adopt the template class names. If it already has a design system, carry over the transparent window, compact dock, `.collapsed-center`, panel shell, and small-button sizing patterns.

The default template uses fixed dock and panel dimensions. Do not let the module list stretch to fill all remaining vertical space. If a user chooses five or more modules, keep module rows stable and scroll the list.

Collapsed mode is layout-sensitive. Do not re-parent `.collapsed-center`, wrap it in another layout container, or move the outer ring into a separate element. In collapsed mode `.liquid-dock`, `.collapsed-quota-rail`, and `.collapsed-center` form one centered stack. This is what keeps the ball and ring attached.

## Dragging Model

Do not rely only on a tiny header drag zone. The island should feel movable from nearly any visible area.

Preferred implementation:

1. Copy `templates/luma-window-drag.js` into the renderer.
2. Expose narrow preload methods:

```js
window.lumaWindow = {
  getBounds(),
  setPosition(x, y)
};
```

3. Implement main-process handlers that only return the current window bounds and set the current window position.
4. Install the drag helper on `.shortcut-stage`.

This pointer-based model allows short clicks to remain clicks and turns movement beyond a small threshold into window dragging. Inputs, textareas, selects, contenteditable nodes, and any explicit no-drag escape class should remain editable.

## IPC Surface

Expose narrow methods instead of broad filesystem or shell access.

Recommended API shape:

```js
window.islandApi = {
  getModules(),
  saveModules(modules),
  getQuickLinks(),
  saveQuickLinks(entries),
  openTarget(cardId),
  openQuickLink(entryId),
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

## First-Version Implementation Order

1. Render static collapsed and expanded island.
2. Add collapsed display config with `暂无用量 -> 100%` and a neutral placeholder for unreadable quota/status data.
3. Add pointer-based window dragging.
4. Load modules from local placeholder JSON.
5. Implement `发帖子` as fixed `https://fawen.fun`.
6. Implement `快捷入口` as a panel with add/name/open behavior.
7. Implement `open-url` or `open-path` for saved entries.
8. Implement `copy-template`.
9. Implement todo capture or status panel.
10. Add minimal config editing only after actions work.
11. Run and test every module.

Do not start with animations, themes, AI agents, sync, or marketplace logic.

## New Project Default

If the user has no repo and asks to build a real desktop app, use the bundled scaffold first:

```bash
node ~/.codex/skills/luma-island-builder/scripts/create-electron-luma.mjs --project /path/to/luma-island-app --name "工作光岛"
```

This creates the Electron main process, preload file, Vite renderer, default Luma CSS, drag helper, local persistence handlers, and package scripts.

Manual fallback: create an Electron app with a Vite renderer. Do not stop after creating the Vite project.

```bash
npm create vite@latest luma-island-demo -- --template react
cd luma-island-demo
npm install
npm install --save-dev electron electron-builder concurrently wait-on
```

Then add:

- an Electron main file
- a preload file
- a renderer island component
- `src/styles.css` copied from `templates/default-luma-island.css`
- `src/assets/prototypes/` copied from `assets/prototypes/`
- pointer dragging copied from `templates/luma-window-drag.js` or implemented equivalently
- local module config
- npm scripts for `dev`, `dev:renderer`, and `dev:electron`
- packaging scripts so the result is a real app, not only a dev preview

The first runnable check should be the desktop shell, for example `npm run dev:electron`, not just `npm run dev`. If a command opens a browser tab, treat that as a renderer check only and continue until the desktop window opens.

## Installable App Requirement

Default delivery is an installed desktop app. A dev server is only for testing.

Use the repo's existing packager if present. If there is no packager, add one such as `electron-builder` or an equivalent local packaging tool.

Minimum user outcome:

- macOS: produce a `.app` and either copy it to `/Applications` or give the user a `.dmg`/zip they can drag into “应用程序”.
- Windows: produce an installer, portable `.exe`, Start menu entry, or desktop shortcut. Tell the user exactly where to open it next time.
- Linux: produce an AppImage, `.deb`, `.rpm`, or a documented launcher.

Suggested package scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "package": "electron-builder",
    "package:mac": "electron-builder --mac",
    "package:win": "electron-builder --win"
  }
}
```

Do not finish by saying only “run npm run dev”. That is not a user-facing app. Do not tell the user the work is done if the visible result is a browser tab or localhost page.

Use persistent user data paths for saved links and copied text templates. Do not store user settings only in source files. In Electron, prefer `app.getPath("userData")` for local JSON files after packaging.

Only build a browser-only prototype when the user explicitly says they do not want a desktop app yet. In that case, state clearly that it is not a real Luma Island until it is wrapped in Electron/Tauri/native shell.

## Verification

After implementation, verify:

- app opens as a desktop window, not a browser tab
- app starts without terminal errors
- app is packaged or installed so the user can find it again
- island appears
- compact and expanded states work
- default renderer CSS is copied or explicitly mapped to the existing design system
- module rows keep stable height when there are 5 or more modules
- collapsed ball and outer ring are concentric in every built-in theme
- window can be dragged from the dock, panel, collapsed trigger, and module buttons while short clicks still work
- `快捷入口` opens a manager panel and can add a named URL before opening it
- compact state shows `100%` when Codex, Claude Code, or another quota source reports no usage
- compact state avoids `--`, `NaN`, empty arcs, and fake reset times when quota sources are unavailable
- each module performs its action
- user-selected copy/template/prompt modules contain the user's content or show an obvious edit form
- clipboard action writes only after click
- local config survives restart when persistence is implemented
- user-provided values are not committed to source
- what each action can do is documented in the module table

For packaged desktop apps, source edits are not enough. If the user expects the installed app to change, rebuild the package, sync the installed output when needed, and restart the app before claiming the visible app is updated.

## Platform Notes

- macOS: packaged apps may need the installed `.app` bundle refreshed before the visible app changes.
- Windows: keep install and config paths user-relative, such as `%USERPROFILE%` and `%APPDATA%`; avoid hard-coded POSIX paths in docs or generated examples.
- Linux: expect window-manager differences around always-on-top, transparency, and drag regions.

## Safety Defaults

- Do not read clipboard by default.
- Do not run arbitrary scripts without explicit confirmation.
- Do not fetch remote data until a status card requires it.
- Do not store user-provided variables in demo fixtures.
- Do not log copied text by default.
- Do not make the island unclickable or impossible to quit.
