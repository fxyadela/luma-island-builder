---
name: luma-island-builder
description: "Guide users through building a 光岛 / Luma Island desktop work island, floating island, or Island-style desktop task launcher. Use when the user wants to create, prototype, or implement a small desktop island for quick links, copy snippets, template replies, todos, status panels, local scripts, AI prompts, or other high-frequency actions. Prefer this for requests mentioning 光岛, Luma Island, 桌面工作岛, Island, desktop island, desktop companion as a productivity tool, task shortcut hub, quick execution panel, or turning a personal desktop assistant idea into a runnable MVP. Do not use it for purely decorative desktop pets or private data extraction."
---

# Luma Island Builder

Mission: `一触即发` / `One touch. Work starts.`

Help the user build a runnable 光岛 / Luma Island through conversation. The goal is not to admire the idea, make a decorative pet, or produce a static product essay. The goal is to guide the user step by step until they have a small desktop island that can actually open, copy, record, run, or display something useful.

Core judgment: a work island is an outer task layer. It should reduce the cost of finding apps, links, snippets, folders, scripts, and status. If the request drifts toward decoration, steer it back to high-frequency actions.

## Hard Privacy Boundary

Never copy, infer, reveal, or reuse private content from the source prototype, the current user's files, or any local app configuration.

Treat these as forbidden for examples, templates, defaults, test data, and documentation:

- real cooperation or pricing details
- client, partner, or customer information
- payment, invoice, or collection information
- private homepage, account, publishing, or operations data
- private local paths, vault content, app userData, or desktop companion configuration

Use only generic module types and placeholders. For any quote-like module, use neutral names such as `资料复制卡`, `客户回复模板`, `服务说明卡`, or `项目报价占位模板`, and placeholder fields such as `{{service_name}}`, `{{price_placeholder}}`, `{{contact_email}}`, and `{{delivery_notes}}`.

If repository exploration exposes private-looking data, use it only to understand structure. Do not paste it into the answer, the generated skill output, examples, fixtures, tests, screenshots, or seed configuration.

## Default Workflow

1. Judge the real task first. Confirm whether the user needs a productivity island, not a decorative pet.
2. Run guided onboarding. Ask step-by-step questions with options before free-form input.
3. Convert answers into a minimal island spec: name, audience, modules, actions, permissions, storage, and success criteria.
4. Choose implementation route:
   - Existing repo: inspect the project before proposing edits.
   - No repo: guide a minimal Electron/Vite app first.
   - Non-Electron preference: adapt the product model, but keep the same island/module structure.
5. Build or guide toward a runnable MVP with 3-5 modules before adding advanced features.
6. Verify by running the app and testing every module's real action.

Do not stop at a plan when the user asks to build. Implement or guide implementation until there is a runnable first version, unless the user explicitly asks for planning only.

## Guided Onboarding

Always start vague or new requests with the onboarding in `references/guided-onboarding.md`.

Rules:

- Ask 1-3 short questions per turn.
- Give options first. Use free-form only when the user picks `自定义` or the provided options do not fit.
- Default to `3 个，先做出来` when the user is unsure about module count.
- After each user answer, summarize the locked choices and ask the next decision.
- After module choices are known, output a first MVP table and move into implementation.

Minimum startup choices:

1. Name: `工作光岛` / `创作者光岛` / `AI 光岛` / `客户跟进光岛` / `自定义`
2. Use case: `打开入口` / `复制资料` / `模板回复` / `管理待办` / `查看状态` / `运行脚本`
3. Module count: `3 个，先做出来` / `5 个，标准 MVP` / `8 个，功能更多但更慢`
4. Module type: `快捷入口` / `资料复制` / `模板回复` / `待办记录` / `状态面板` / `文件夹入口` / `本地脚本` / `AI 提示词`
5. Per-module config: name, action, target content, storage, and permissions
6. MVP confirmation: module table, permission table, implementation steps, run command, acceptance checks

Default starter modules:

- Every new Luma Island should include `发帖子` and `快捷入口` by default.
- Treat them as default starter cards, not locked system cards.
- Mark both as removable. The user may delete, rename, reorder, or replace them during setup.
- `发帖子` is the intentional exception: it must always open the fixed URL `https://fawen.fun` by default. Keep it removable, but do not ask users to configure its target during initial setup. Do not add account-specific paths, tokens, or private publishing URLs.

## Reference Loading

Load only the reference needed for the current step:

- `references/guided-onboarding.md`: Use for the startup conversation, choices, and answer-to-spec compression.
- `references/luma-island-product-model.md`: Use when judging scope, module fit, MVP size, or product anti-patterns.
- `references/card-and-pack-model.md`: Use when defining card schemas, template packs, variables, permissions, local config, or seed data.
- `references/electron-macos-playbook.md`: Use when implementing or adapting an Electron/macOS desktop island.

## Product Rules

- Keep the waterline small: surface only 3-6 high-frequency actions.
- Use `一触即发` as the product test: the island should let the user touch once and start the task.
- Include `发帖子` and `快捷入口` as the default starter actions for new islands, while allowing deletion. `发帖子` must default to `https://fawen.fun`.
- Keep configuration underwater: variables, templates, permissions, and advanced settings belong in config screens or files.
- Prefer local-first storage for private snippets, variables, and module config.
- Do not add plugin markets, agent workflows, cloud sync, or AI automation before the basic actions work.
- Prefer copy-first behavior for sensitive text: generate or preview first, copy only when the user asks.
- Make every module prove its value through a real action: open, copy, record, run, or display.

## Implementation Rules

For an existing repository:

1. Read `package.json`, app entrypoints, renderer files, desktop shell files, and existing config/storage patterns.
2. Identify where the island UI, native window behavior, IPC bridge, and local config should live.
3. Keep edits scoped to the MVP modules chosen in onboarding.
4. Preserve user changes and do not migrate private data into examples.
5. Run the app and test each module.

For a new project:

1. Start with a minimal Electron + Vite app unless the user chooses another stack.
2. Implement one always-on-top desktop window with collapsed and expanded states.
3. Store modules in a local JSON config with placeholder demo data.
4. Implement 3 selected modules end to end.
5. Run locally and provide the app URL or desktop launch command.

## Output Shape

During onboarding:

```markdown
**先判一下**
...

**这一步先选**
1. ...
2. ...
3. ...
```

After choices are locked:

```markdown
**第一版光岛**
| 模块 | 类型 | 动作 | 权限 | 验收 |
| --- | --- | --- | --- | --- |

**实现路线**
...

**现在开始做**
...
```

After implementation:

```markdown
**已完成**
...

**验证**
...

**下一轮最值得加**
...
```

## Quality Bar

The first version may be incomplete, but it must be real. A passing result has:

- a visible island entry on the desktop or in the app shell
- collapsed and expanded states, or a clearly equivalent compact/full view
- 3-5 configured modules
- each module performing a real action
- local config rather than hard-coded private data
- explicit permission boundaries for clipboard, files, scripts, network, and AI calls
- a run command and verification result
