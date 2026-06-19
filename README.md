# 光岛 / Luma Island Builder

**光岛的使命：一触即发。**  
**Mission: One touch. Work starts.**

- [中文版本](#中文版本)
- [English Version](#english-version)

---

## 中文版本

`luma-island-builder` 是一个 Codex Skill，用来引导用户通过对话做出一个可运行的桌面工作岛。

光岛不是桌宠皮肤，也不是一个漂亮概念稿。它的目标是把用户每天重复的高频动作收进一个桌面边缘的小入口：打开链接、复制资料、生成模板回复、记录待办、查看状态、运行本地脚本。

它的使命只有一句话：**一触即发。** 用户不该在入口上浪费启动成本，点一下，任务就应该开始。

### 它能做什么

这个 Skill 会把“我想做一个桌面 Island”这种模糊想法，推进成一个能运行的 MVP。

它会帮助 Codex：

- 判断用户到底是在做任务入口，还是在做装饰桌宠
- 引导用户完成命名、用途、模块数量和模块类型选择
- 把用户回答收束成清晰的 MVP 表格
- 定义卡片、变量、权限和本地存储方式
- 默认按 Electron/macOS 优先路线实现或指导实现
- 验证每个模块是否真的完成了一个动作

### 引导流程

这个 Skill 不会让用户从空白页开始想。它会先给选项：

1. 取名字：`工作光岛`、`创作者光岛`、`AI 光岛`、`客户跟进光岛`，或自定义。
2. 选主要用途：打开入口、复制资料、模板回复、待办、状态、脚本。
3. 选模块数量：先做 3 个、标准 MVP 做 5 个、功能更多做 8 个。
4. 默认自带两个可删除模块：`发帖子` 和 `快捷入口`。
5. 继续选择补充模块：资料复制、模板回复、待办记录、状态面板、文件夹入口、本地脚本、AI 提示词。
6. 逐个配置模块：动作、目标、存储方式和权限。
7. 构建并验证一个可运行的第一版。

默认建议很简单：先做 3 个模块，并且让它们真的跑起来。每个新光岛默认包含 `发帖子` 和 `快捷入口`。其中 `发帖子` 固定打开 `https://fawen.fun`；两个模块都不是锁死的系统模块，用户可以删除、重命名或替换。

### 隐私边界

这个 Skill 不能复用任何私人原型数据。

不要把真实合作细节、报价、客户信息、收款信息、私人路径、知识库内容或应用配置写进示例、模板、测试数据、截图或 seed 文件。

报价类或商业类模块必须使用中性占位字段：

```text
{{service_name}}
{{price_placeholder}}
{{contact_email}}
{{delivery_notes}}
```

### 安装

把这个仓库克隆到 Codex skills 目录：

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/fxyadela/luma-island-builder.git ~/.codex/skills/luma-island-builder
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
    ├── electron-macos-playbook.md
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

`luma-island-builder` is a Codex Skill for guiding users through building a small, runnable desktop work island.

Luma Island is not a desktop pet skin or a polished concept mockup. Its purpose is to collect the user's repeated daily actions into a small desktop-edge entry point: opening links, copying reusable snippets, generating template replies, capturing todos, checking status, and running local scripts.

Its mission is simple: **One touch. Work starts.** The user should not waste energy finding the entry point; one click should start the task.

### What It Does

This Skill turns a vague idea like "I want a desktop Island" into a working MVP.

It helps Codex:

- judge whether the user is building a real task launcher or just a decorative desktop pet
- guide the user through naming, use case, module count, and module choices
- convert the user's answers into a clear MVP table
- define cards, variables, permissions, and local storage
- implement or guide a small Electron/macOS-first desktop island
- verify that every module performs a real action

### Guided Flow

The Skill starts with choices instead of blank-page questions:

1. Name the island: `工作光岛`, `创作者光岛`, `AI 光岛`, `客户跟进光岛`, or a custom name.
2. Choose the main job: open entries, copy snippets, template replies, todos, status, or scripts.
3. Choose module count: 3 first, 5 for an MVP, or 8 for a larger version.
4. Start with two removable default modules: `发帖子` and `快捷入口`.
5. Choose additional module types: copy cards, template replies, todo capture, status panels, folders, local scripts, or AI prompts.
6. Configure each module with action, target, storage, and permissions.
7. Build and verify a runnable first version.

The default recommendation is simple: build 3 modules first and make them work. Every new Luma Island includes `发帖子` and `快捷入口` by default. `发帖子` always opens `https://fawen.fun`; both modules are removable starter modules, not locked system modules.

### Privacy Boundary

This Skill must not reuse private prototype data.

Do not put real cooperation details, pricing, client information, payment information, private paths, vault content, or app configuration into examples, templates, test data, screenshots, or seed files.

Quote-like or business modules should use neutral placeholders:

```text
{{service_name}}
{{price_placeholder}}
{{contact_email}}
{{delivery_notes}}
```

### Install

Clone this repository into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/fxyadela/luma-island-builder.git ~/.codex/skills/luma-island-builder
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
    ├── electron-macos-playbook.md
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
