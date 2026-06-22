# Card And Pack Model

Use this reference when converting onboarding answers into data structures. Keep schemas simple enough for a first implementation.

## Card Manifest

Every module should be represented as a card. Do not hard-code private data into UI components.

```json
{
  "id": "copy-service-summary",
  "type": "copy-template",
  "title": "服务说明卡",
  "description": "复制一段通用服务说明占位文本",
  "icon": "clipboard",
  "action": {
    "kind": "copy",
    "template": "{{service_name}}\\n{{price_placeholder}}\\n{{delivery_notes}}"
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
- `type`: one of `open-link`, `open-path`, `copy-template`, `template-reply`, `todo-capture`, `status-panel`, `run-script`, `prompt-copy`
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
    "type": "open-link",
    "title": "快捷入口",
    "description": "打开一个常用网页、文件夹、应用或项目",
    "icon": "external-link",
    "action": {
      "kind": "open-url",
      "url": "{{quick_entry_url}}"
    },
    "permissions": ["network.open"],
    "placement": {
      "surface": "main",
      "order": 1
    },
    "removable": true
  }
]
```

These cards are default starter cards, not locked system cards. The user may delete, rename, reorder, or replace them. `发帖子` intentionally uses the fixed URL `https://fawen.fun`; do not add account-specific paths, tokens, workspace paths, or other private targets.

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

### Copy Template

```json
{
  "kind": "copy",
  "template": "{{contact_email}}\\n{{delivery_notes}}"
}
```

Permissions: `clipboard.write`, optionally `vault.read`

### Template Reply

```json
{
  "kind": "fill-template",
  "template": "你好，{{client_name}}。这里是 {{service_name}} 的项目说明：{{delivery_notes}}",
  "variables": ["client_name", "service_name", "delivery_notes"]
}
```

Permissions: `clipboard.write`, optionally `vault.read`

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

Use variables for user-specific values. Store private values outside source code.

```json
{
  "contact_email": "name@example.com",
  "service_name": "Example Service",
  "price_placeholder": "Price discussed separately",
  "delivery_notes": "Delivery details go here"
}
```

Never seed real private data. Use placeholders in examples and tests.

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
    "fallbackLabel": "{{nickname}}",
    "quotaSources": ["codex", "claude-code"],
    "missingDataBehavior": "show-fallback-label"
  }
}
```

Supported `style` values:

- `taiji-quota`: paired quota/status visual; fall back to nickname or island name when data is absent
- `fridge-door`: rounded door object with handle/opening metaphor
- `liquid-capsule`: vertical capsule with liquid layer, glow, or center mark
- `custom`: user-provided visual description or reference image translated into implementation specs

Fallback order for missing quota/status data:

1. valid quota or status data
2. configured source nickname
3. user nickname or team display name
4. island name

Never seed real account names, private paths, or quota screenshots in committed config. Use placeholders such as `{{nickname}}`, `{{island_name}}`, and `{{quota_source_label}}`.

## Permission Vocabulary

Use explicit permissions:

- `network.open`: open external URLs
- `network.read`: fetch remote data
- `clipboard.write`: write to clipboard
- `clipboard.read`: read clipboard, avoid unless essential
- `file.open`: open local path
- `file.read`: read local file
- `file.write`: write local file
- `storage.read`: read app local config
- `storage.write`: write app local config
- `vault.read`: read private variable store
- `script.run`: run local commands
- `ai.call`: call AI service

Prefer the narrowest permission. Ask before adding `clipboard.read`, `file.read`, `file.write`, `script.run`, or `ai.call`.

## Storage Defaults

For Electron:

- module config: app userData JSON
- private variables: separate local JSON or OS credential storage when available
- todos: local JSON or Markdown chosen by user
- click stats: local JSON

For browser-only prototypes:

- module config: localStorage
- private variables: placeholders only
- todos: localStorage

Do not store private data in committed source files.
