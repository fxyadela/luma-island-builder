# 光岛 / Luma Island Builder

`luma-island-builder` is a Codex Skill for guiding users through building a small, runnable desktop work island.

光岛不是桌宠皮肤，也不是一个漂亮概念稿。它的目标是把用户每天重复的高频动作收进一个桌面边缘的小入口：打开链接、复制资料、生成模板回复、记录待办、查看状态、运行本地脚本。

## What It Does

This Skill turns a vague idea like “I want a desktop Island” into a working MVP through a guided conversation.

It helps Codex:

- judge whether the user is building a real task launcher or just a decorative desktop pet
- guide the user through naming, use case, module count, and module choices
- convert answers into a clear MVP table
- define cards, variables, permissions, and local storage
- implement or guide a small Electron/macOS-first desktop island
- verify that every module performs a real action

## Guided Flow

The Skill starts with choices instead of blank-page questions:

1. Name the island: `工作光岛`, `创作者光岛`, `AI 光岛`, `客户跟进光岛`, or custom.
2. Choose the main job: open entries, copy snippets, template replies, todos, status, or scripts.
3. Choose module count: 3 first, 5 for MVP, or 8 for a larger version.
4. Choose module types: quick links, copy cards, template replies, todos, status panels, folders, scripts, or AI prompts.
5. Configure each module with action, target, storage, and permissions.
6. Build and verify a runnable first version.

The default recommendation is simple: build 3 modules first and make them work.

## Privacy Boundary

This Skill must not reuse private prototype data.

Do not put real cooperation details, pricing, client information, payment information, private paths, vault content, or app configuration into examples, templates, test data, screenshots, or seed files.

Quote-like or business modules should use neutral placeholders:

```text
{{service_name}}
{{price_placeholder}}
{{contact_email}}
{{delivery_notes}}
```

## Install

Clone this repository into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/fxyadela/luma-island-builder.git ~/.codex/skills/luma-island-builder
```

Then restart or refresh Codex so the Skill can be discovered.

## Usage

Invoke it explicitly:

```text
Use $luma-island-builder to help me build a Luma Island desktop work island for my daily shortcuts, copy snippets, templates, and status checks.
```

Chinese example:

```text
用 $luma-island-builder 帮我做一个光岛。第一版只要 3 个模块：打开项目、复制通用资料、记录待办。
```

## Files

```text
.
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── card-and-pack-model.md
    ├── electron-macos-playbook.md
    ├── guided-onboarding.md
    └── luma-island-product-model.md
```

## Validation

Run the Codex Skill validator:

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py ~/.codex/skills/luma-island-builder
```

Expected result:

```text
Skill is valid!
```
