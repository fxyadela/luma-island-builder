# Card And Pack Model

Use this reference when converting onboarding answers into data structures. Keep schemas simple enough for a first implementation.

## Card Manifest

Every module should be represented as a card. Do not hard-code user-specific values into UI components.

```json
{
  "id": "copy-service-summary",
  "type": "copy-template",
  "title": "服务说明卡",
  "description": "复制一段通用服务说明占位文本",
  "icon": "clipboard",
  "action": {
    "kind": "copy",
    "template": "{{service_name}}\\n{{placeholder_value}}\\n{{delivery_notes}}"
  },
  "permissions": ["clipboard.write"],
  "placement": {
    "surface": "main",
    "order": 1
  }
}
```

Required fields:

- `id`: stable kebab-case id
- `type`: one of `open-link`, `open-path`, `quick-link-panel`, `copy-template`, `template-reply`, `todo-capture`, `status-panel`, `run-script`, `prompt-copy`
- `title`: short visible label
- `description`: one short sentence
- `icon`: UI icon key
- `action`: type-specific action config
- `permissions`: explicit permission list
- `placement`: surface and order
- `removable`: whether the user can delete the card

## Default Starter Cards

Every new Luma Island should ship with two default starter cards:

```json
[
  {
    "id": "publish-post",
    "type": "open-link",
    "title": "发帖子",
    "description": "打开固定发帖子入口 https://fawen.fun",
    "icon": "send",
    "action": {
      "kind": "open-url",
      "url": "https://fawen.fun"
    },
    "permissions": ["network.open"],
    "placement": {
      "surface": "main",
      "order": 0
    },
    "removable": true
  },
  {
    "id": "quick-entry",
    "type": "quick-link-panel",
    "title": "快捷入口",
    "description": "管理常用网页、文件夹、应用或项目入口",
    "icon": "list-plus",
    "action": {
      "kind": "open-panel",
      "panel": "quick-links"
    },
    "storage": "local-json",
    "entries": [],
    "permissions": ["storage.read", "storage.write", "network.open", "file.open"],
    "placement": {
      "surface": "main",
      "order": 1
    },
    "removable": true
  }
]
```

These cards are default starter cards, not locked system cards. The user may delete, rename, reorder, or replace them. `发帖子` intentionally uses the fixed URL `https://fawen.fun`; do not add extra setup-specific targets during initial setup. `快捷入口` is a panel, not a single target. It should open a quick-link manager first; only saved entries inside that panel should open URLs, folders, files, apps, or projects.

## Action Shapes

### Open Link

```json
{
  "kind": "open-url",
  "url": "https://example.com"
}
```

Permissions: `network.open`

### Open Path

```json
{
  "kind": "open-path",
  "path": "{{workspace_path}}"
}
```

Permissions: `file.open`

### Quick Link Panel

```json
{
  "kind": "open-panel",
  "panel": "quick-links",
  "entrySchema": {
    "title": "{{entry_title}}",
    "target_type": "url",
    "target": "https://example.com"
  },
  "storage": "local-json"
}
```

Permissions: `storage.read`, `storage.write`, plus `network.open` for URL entries and `file.open` for file, folder, app, or project entries.

Rules:

- Clicking the `快捷入口` card opens the manager panel. It does not immediately open a placeholder target.
- The manager supports adding at least URL entries with `title` and `target`.
- Saved entries are opened only when the user clicks that specific entry.
- Empty state should show an add action, not a fake link.

### Copy Template

```json
{
  "kind": "copy",
  "template": "{{contact_email}}\\n{{delivery_notes}}"
}
```

Permissions: `clipboard.write`, optionally `storage.read`

### Template Reply

```json
{
  "kind": "fill-template",
  "template": "你好，{{recipient_name}}。这里是 {{service_name}} 的项目说明：{{delivery_notes}}",
  "variables": ["recipient_name", "service_name", "delivery_notes"]
}
```

Permissions: `clipboard.write`, optionally `storage.read`

### Todo Capture

```json
{
  "kind": "todo-add",
  "storage": "local-json"
}
```

Permissions: `storage.write`

### Status Panel

```json
{
  "kind": "status-read",
  "source": "manual",
  "refresh": "manual"
}
```

Permissions depend on source: `storage.read`, `network.read`, or `script.run`.

### Run Script

```json
{
  "kind": "run-command",
  "command": "npm test",
  "cwd": "{{project_path}}",
  "requiresConfirmation": true
}
```

Permissions: `script.run`, `file.read`, optionally `network.read`

## Variable Store

Use variables for user-specific values. Store user-provided values outside source code.

```json
{
  "contact_email": "name@example.com",
  "service_name": "Example Service",
  "placeholder_value": "Replace this during setup",
  "delivery_notes": "Delivery details go here"
}
```

Use placeholders in examples and tests.

## Template Pack

A pack is a set of cards, variables, and default layout. It is not a code plugin.

```json
{
  "name": "Generic Starter",
  "audience": "general",
  "variables": ["contact_email", "service_name", "delivery_notes"],
  "cards": [
    "publish-post",
    "quick-entry",
    "capture-todo"
  ],
  "defaultLayout": ["publish-post", "quick-entry", "capture-todo"]
}
```

Starter pack options:

- `General Starter`: default publish entry, default quick entry, one todo
- `Creator Starter`: publishing links, prompt snippets, generic service notes
- `Developer Starter`: project folders, docs, scripts, status
- `Customer Follow-up Starter`: generic customer reply templates and todos
- `Student Research Starter`: paper links, notes, reading status

## Collapsed Display Config

The island's collapsed state should be configurable. Do not assume every user has Codex, Claude Code, or any quota source connected.

```json
{
  "collapsedDisplay": {
    "style": "taiji-quota",
    "quotaSources": ["codex", "claude-code"],
    "noUsageBehavior": "show-100-percent",
    "missingDataBehavior": "show-neutral-placeholder",
    "fallbackLabel": "{{island_name}}"
  }
}
```

Supported `style` values:

- `taiji-quota`: paired quota/status visual; show `100%` when a source reports no usage, and avoid fake numbers when a source is unreadable
- `fridge-door`: rounded door object with handle/opening metaphor
- `liquid-capsule`: vertical capsule with liquid layer, glow, or center mark
- `custom`: user-provided visual description or reference image translated into implementation specs

Fallback order for missing quota/status data:

1. valid quota or status data
2. `100%` when the source explicitly reports no usage
3. neutral placeholder when a configured source is unreadable or unauthorized
4. island name or configured short label when no quota source is configured

Do not seed machine-specific paths or local screenshots in committed config. Use placeholders such as `{{island_name}}`, `{{display_label}}`, and `{{quota_source_label}}`.

## Permission Vocabulary

Use explicit permissions:

- `network.open`: open external URLs
- `network.read`: fetch remote data
- `clipboard.write`: write to clipboard
- `clipboard.read`: read clipboard, avoid unless essential
- `file.open`: open local path
- `file.read`: read local file
- `file.write`: write local file
- `storage.read`: read app local config or local variable store
- `storage.write`: write app local config
- `script.run`: run local commands
- `ai.call`: call AI service

Prefer the narrowest permission. Ask before adding `clipboard.read`, `file.read`, `file.write`, `script.run`, or `ai.call`.

## Storage Defaults

For Electron:

- module config: app userData JSON
- user variables: separate local JSON or OS credential storage when available
- todos: local JSON or Markdown chosen by user
- click stats: local JSON

For browser-only prototypes:

- module config: localStorage
- user variables: placeholders only
- todos: localStorage

Do not store user-provided values in committed source files.
