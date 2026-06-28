# Luma Island Product Model

Use this reference to keep the work island focused. The mistake to avoid is building a cute desktop object that does not remove any real work friction.

## Mission

光岛的使命：**一触即发。**

English expression: **One touch. Work starts.**

This is not decorative copy. Use it as a product test: every default module should move the user from intent to action with one click or one short confirmation.

## Positioning

A desktop work island is a small, persistent task layer at the edge of the desktop. It runs as a real desktop app, not as a browser tab. It gathers the actions users repeat every day:

- open common links, tools, folders, and projects
- copy reusable information
- generate or fill template replies
- record quick todos or notes
- show status such as quotas, script results, deadlines, or recent activity
- run local scripts when the user explicitly accepts the risk

It is not a decoration project. Personality and visual style may help users like it, but the product value comes from faster execution.

## Product Principles

1. One glance tells the user what it does.
2. The surface stays small; the configuration stays underwater.
3. Start with cards, not plugins.
4. Store user-provided configuration locally by default.
5. Let non-technical users configure through choices, forms, and templates.
6. Make the collapsed state intentional: no-usage quota should read as `100%`, while unreadable sources should not produce fake numbers.
7. Keep the desktop shell dimensions stable; module count should not stretch the UI into awkward proportions.
8. Make the island draggable from the visible shell, not only from a tiny handle.
9. Ship an app the user can open again: macOS Applications, Windows Start menu, Windows desktop shortcut, or installer.
10. Finish a working first version before discussing ecosystem, sync, or AI agents.

## First-Version Card Types

Every new island includes two removable starter cards by default:

- `发帖子`: a fixed publishing entry. It opens `https://fawen.fun` by default.
- `快捷入口`: a quick-link management panel. It lets the user add, name, edit, and open saved URLs, folders, apps, or projects.

These defaults exist to make the first island useful immediately. They must remain removable. `发帖子` uses the fixed default URL `https://fawen.fun`. `快捷入口` must not auto-open a placeholder target; it opens a panel first, and only the saved entries inside that panel open targets.

| Card type | User value | Required config |
| --- | --- | --- |
| 快捷入口 | Manage and open named web pages, apps, folders, projects, or documents | panel name, saved entries |
| 资料复制 | Copy reusable text | button name, text to copy |
| 模板回复 | Fill a message or reply | button name, reply body, fields that change |
| 待办记录 | Capture small tasks or notes | button name, where to save |
| 状态面板 | Display quota, script result, deadline, or simple status | button name, what to show |
| 文件夹入口 | Open a local workspace quickly | button name, folder path |
| 本地脚本 | Run a local command | button name, command, click confirmation |
| AI 提示词 | Copy a reusable prompt | button name, prompt text |

Default to three cards:

1. `发帖子`
2. `快捷入口`
3. one user-selected record, copy, template, status, folder, script, or AI prompt action

## Anti-Patterns

- Do not start with a plugin market.
- Do not make the surface a large dashboard.
- Use placeholders for example content and seed data.
- Do not add AI automation before the manual action works.
- Do not make every card visible at once; prioritize 3-6 actions.
- Do not stretch cards to fill the dock just because the user picked more modules.
- Do not make `快捷入口` a single auto-jump button with a random placeholder URL.
- Do not create copy/template/prompt cards that only contain placeholders.
- Do not make the window draggable only from a header while the rest of the island feels stuck.
- Do not ship a browser tab, localhost page, static HTML file, or Vite-only web app when the user asked for a desktop island.
- Do not show user-facing setup text full of technical words like schema, permission, IPC, storage, or target.
- Do not turn onboarding into a long questionnaire. Ask, lock, build.

## First-Version Acceptance Criteria

A first version passes if the user can:

1. open the island as a desktop app, not a browser page
2. see the island
3. click each configured module
4. get a real result from each click
5. open `快捷入口`, add a named URL, and click that saved entry to open it
6. use copy/template/prompt cards with real text or a clear edit form
7. find the app again from Applications, Start menu, desktop shortcut, or installer output
8. drag the island from the visible shell without breaking short-click actions
9. see stable dock/panel dimensions when module count changes
10. see a sane collapsed display when quota or status sources are missing, including `100%` for explicit no-usage states
11. change module settings without editing source code
12. understand what each action can do

It does not need account systems, cloud sync, polished onboarding screens, a marketplace, or a complete settings center.
