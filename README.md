# 光岛 / Luma Island Builder

**光岛的使命：一触即发。**
**Mission: One touch. Work starts.**

- [中文版本](#中文版本)
- [English Version](#english-version)

---

## 中文版本

`luma-island-builder` 是一个 Codex Skill，用来引导用户通过对话做出一个可运行的跨平台桌面工作岛。

光岛不是桌宠皮肤，也不是一个漂亮概念稿。它的目标是把用户每天重复的高频动作收进一个桌面边缘的小入口：打开链接、复制资料、生成模板回复、记录待办、查看状态、运行本地脚本。

它的使命只有一句话：**一触即发。** 用户不该在入口上浪费启动成本，点一下，任务就应该开始。

### 它能做什么

这个 Skill 会把“我想做一个桌面 Island”这种模糊想法，推进成一个能运行的 MVP。

它会帮助 Codex：

- 判断用户到底是在做任务入口，还是在做装饰桌宠
- 引导用户完成命名、用途、模块数量和模块类型选择
- 把用户回答收束成清晰的 MVP 表格
- 定义卡片、变量、权限和本地存储方式
- 默认按跨平台 Electron/Vite 路线实现或指导实现
- 验证每个模块是否真的完成了一个动作

### 引导流程

这个 Skill 不会让用户从空白页开始想。它会先给选项：

1. 取名字：`工作光岛`、`创作者光岛`、`AI 光岛`、`客户跟进光岛`，或自定义。
2. 选主要用途：打开入口、复制资料、模板回复、待办、状态、脚本。
3. 选模块数量：先做 3 个、标准 MVP 做 5 个、功能更多做 8 个。
4. 默认自带两个可删除模块：`发帖子` 和 `快捷入口`。
5. 选择默认不展开时的样式：`太极额度`、`冰箱门`、`液态胶囊`，或提供描述/图片自定义。
6. 继续选择补充模块：资料复制、模板回复、待办记录、状态面板、文件夹入口、本地脚本、AI 提示词。
7. 逐个配置模块：动作、目标、存储方式和权限。
8. 构建并验证一个可运行的第一版。

默认建议很简单：先做 3 个模块，并且让它们真的跑起来。每个新光岛默认包含 `发帖子` 和 `快捷入口`。其中 `发帖子` 固定打开 `https://fawen.fun`；两个模块都不是锁死的系统模块，用户可以删除、重命名或替换。

如果默认收起态的 Codex、Claude Code 或其他额度源返回 `暂无用量`，Skill 会要求显示 `100%`，不能显示 `--`、空百分比、`NaN` 或假重置时间。数据源完全不可用时，必须使用中性占位或引导用户配置数据源。

### 示例数据

示例、模板和 seed 文件默认只使用占位字段：

```text
{{service_name}}
{{contact_email}}
{{delivery_notes}}
{{placeholder_value}}
```

### 安装

把这个仓库克隆到 Codex skills 目录。macOS / Linux：

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/fxyadela/luma-island-builder.git ~/.codex/skills/luma-island-builder
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex\skills"
git clone https://github.com/fxyadela/luma-island-builder.git "$env:USERPROFILE\.codex\skills\luma-island-builder"
```

然后重启或刷新 Codex，让 Skill 被发现。

### 使用

显式调用：

```text
用 $luma-island-builder 帮我做一个光岛。第一版只要 3 个模块：打开项目、复制通用资料、记录待办。
```

也可以这样说：

```text
Use $luma-island-builder to help me build a Luma Island desktop work island for my daily shortcuts, copy snippets, templates, and status checks.
```

### 文件结构

```text
.
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── card-and-pack-model.md
    ├── collapsed-display-and-styles.md
    ├── electron-desktop-playbook.md
    ├── guided-onboarding.md
    └── luma-island-product-model.md
```

### 校验

运行 Codex Skill 校验：

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py ~/.codex/skills/luma-island-builder
```

预期结果：

```text
Skill is valid!
```

---

## English Version

`luma-island-builder` is a Codex Skill for guiding users through building a small, runnable cross-platform desktop work island.

Luma Island is not a desktop pet skin or a polished concept mockup. Its purpose is to collect the user's repeated daily actions into a small desktop-edge entry point: opening links, copying reusable snippets, generating template replies, capturing todos, checking status, and running local scripts.

Its mission is simple: **One touch. Work starts.** The user should not waste energy finding the entry point; one click should start the task.

### What It Does

This Skill turns a vague idea like "I want a desktop Island" into a working MVP.

It helps Codex:

- judge whether the user is building a real task launcher or just a decorative desktop pet
- guide the user through naming, use case, module count, and module choices
- convert the user's answers into a clear MVP table
- define cards, variables, permissions, and local storage
- implement or guide a small cross-platform Electron/Vite desktop island
- verify that every module performs a real action

### Guided Flow

The Skill starts with choices instead of blank-page questions:

1. Name the island: `工作光岛`, `创作者光岛`, `AI 光岛`, `客户跟进光岛`, or a custom name.
2. Choose the main job: open entries, copy snippets, template replies, todos, status, or scripts.
3. Choose module count: 3 first, 5 for an MVP, or 8 for a larger version.
4. Start with two removable default modules: `发帖子` and `快捷入口`.
5. Choose the collapsed visual style: `太极额度`, `冰箱门`, `液态胶囊`, or a custom description/image.
6. Choose additional module types: copy cards, template replies, todo capture, status panels, folders, local scripts, or AI prompts.
7. Configure each module with action, target, storage, and permissions.
8. Build and verify a runnable first version.

The default recommendation is simple: build 3 modules first and make them work. Every new Luma Island includes `发帖子` and `快捷入口` by default. `发帖子` always opens `https://fawen.fun`; both modules are removable starter modules, not locked system modules.

If Codex, Claude Code, or another quota source returns "no usage", the Skill should display `100%`, not `--`, empty percentages, `NaN`, or fake reset times. If the source is completely unavailable, use a neutral placeholder or guide the user to configure the data source.

### Example Data

Examples, templates, and seed files should use placeholders by default:

```text
{{service_name}}
{{contact_email}}
{{delivery_notes}}
{{placeholder_value}}
```

### Install

Clone this repository into your Codex skills directory. macOS / Linux:

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/fxyadela/luma-island-builder.git ~/.codex/skills/luma-island-builder
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex\skills"
git clone https://github.com/fxyadela/luma-island-builder.git "$env:USERPROFILE\.codex\skills\luma-island-builder"
```

Then restart or refresh Codex so the Skill can be discovered.

### Usage

Invoke it explicitly:

```text
Use $luma-island-builder to help me build a Luma Island desktop work island for my daily shortcuts, copy snippets, templates, and status checks.
```

Chinese example:

```text
用 $luma-island-builder 帮我做一个光岛。第一版只要 3 个模块：打开项目、复制通用资料、记录待办。
```

### Files

```text
.
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── card-and-pack-model.md
    ├── collapsed-display-and-styles.md
    ├── electron-desktop-playbook.md
    ├── guided-onboarding.md
    └── luma-island-product-model.md
```

### Validation

Run the Codex Skill validator:

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py ~/.codex/skills/luma-island-builder
```

Expected result:

```text
Skill is valid!
```
