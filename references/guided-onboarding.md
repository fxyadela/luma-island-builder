# Guided Onboarding

Use this reference whenever a user starts a new work island or gives a vague island idea. The goal is to lead them through decisions, not ask them to invent a product from a blank page.

## Conversation Rules

- Ask 1-3 questions per turn.
- Give options first.
- Include `自定义` only when the decision genuinely benefits from user-specific wording.
- If the user says "随便" or hesitates, choose the recommended default and state it.
- After every answer, compress it into a locked spec line.
- Move to implementation once name, use case, module count, and module types are known.

## Default Starter Modules

Every new 光岛 starts with two default modules:

1. `发帖子` - a generic publishing entry for opening the user's chosen publishing surface.
2. `快捷入口` - a generic quick-link group for commonly opened URLs, folders, apps, or projects.

These are starter modules, not locked system modules. Set `removable: true` for both. The user can delete, rename, reorder, or replace them during setup.

Do not assume any real platform, account, URL, workspace, or private publishing target. Use placeholders until the user provides their own targets.

## Step 1: Name The Island

Prompt:

```markdown
先别急着做 UI，第一步先给这个岛定一个名字。名字决定它是工具还是玩具。

你选一个：
1. 工作光岛 - 通用效率入口
2. 创作者光岛 - 发文、素材、资料、模板
3. AI 光岛 - 模型、提示词、额度、常用入口
4. 客户跟进光岛 - 客户资料、回复、待办、状态
5. 自定义 - 你自己起名
```

Default: `工作光岛`

## Step 2: Choose The Main Job

Prompt:

```markdown
这个岛第一版最该帮你省哪种时间？

1. 打开入口 - 常用网页、文件夹、项目、后台
2. 复制资料 - 邮箱、介绍、地址、说明、占位信息
3. 模板回复 - 客户回复、项目说明、邮件、私信
4. 管理待办 - 快速记任务、今天要做什么
5. 查看状态 - 额度、脚本结果、截止时间、服务状态
6. 运行脚本 - 本地命令、构建、同步、检查
```

Allow multiple choices, but warn if the user chooses more than three for the first version.

## Step 3: Choose Module Count

Prompt:

```markdown
第一版不要贪。你想先做几个模块？

默认会自带两个可删除模块：发帖子、快捷入口。

1. 3 个，先做出来 - 推荐，2 个默认模块 + 1 个你自己选的模块
2. 5 个，标准 MVP - 2 个默认模块 + 3 个你自己选的模块
3. 8 个，功能更多但更慢 - 适合已有清晰需求
```

Default: `3 个，先做出来`

## Step 4: Choose Module Types

Prompt:

```markdown
默认已经有：发帖子、快捷入口。接下来选你还要补的模块：

1. 资料复制 - 点一下复制一段固定信息
2. 模板回复 - 用变量生成一段回复
3. 待办记录 - 快速记一条任务
4. 状态面板 - 看一个状态或额度
5. 文件夹入口 - 打开本地目录
6. 本地脚本 - 运行命令，需要明确风险
7. AI 提示词 - 复制或打开常用提示词
8. 更多快捷入口 - 在默认快捷入口外再加一个入口组
```

If the user chooses quote-like or commercial modules, rename them to neutral module names such as `项目报价占位模板`, `服务说明卡`, or `客户回复模板`. Never ask for or include real pricing.

## Step 5: Configure Each Module

Ask one module at a time.

### 发帖子

Ask:

```markdown
发帖子是默认模块，可以删除。你想让它打开什么？

1. 发布网页 URL
2. 发布工具或应用
3. 内容草稿文件夹
4. 先保留占位，之后再填
5. 删除这个默认模块
```

Fields:

- `title`: `发帖子`
- `type`: `open-link` or `open-path`
- `target_type`
- `target`
- `removable`: `true`
- `permission`: `network.open` or `file.open`

Use placeholder targets until the user provides their own target.

### 快捷入口

Ask:

```markdown
快捷入口是默认模块，可以删除。这个快捷入口要放什么？

选目标类型：
1. 网页 URL
2. 本地文件夹
3. 本地文件
4. 应用或项目
5. 先保留占位，之后再填
6. 删除这个默认模块
```

Fields:

- `title`
- `target_type`
- `target`
- `removable`: `true`
- `permission`: `network.open` or `file.open`

### 资料复制

Ask:

```markdown
这张资料复制卡先用占位内容，不填真实隐私。你要它复制哪类信息？

1. 个人介绍占位
2. 项目说明占位
3. 联系方式占位
4. 服务信息占位
5. 自定义占位
```

Fields:

- `title`
- `template`
- `sensitivity`: `public`, `internal`, or `private`
- `permission`: `clipboard.write`

Use placeholders only:

```text
{{service_name}}
{{price_placeholder}}
{{contact_email}}
{{delivery_notes}}
```

### 模板回复

Ask:

```markdown
模板回复先选用途：

1. 客户跟进
2. 项目说明
3. 预约确认
4. 交付说明
5. FAQ 回复
```

Fields:

- `title`
- `template`
- `variables`
- `permission`: `clipboard.write`

### 待办记录

Ask:

```markdown
待办记录存在哪里？

1. 本地 JSON
2. 本地 Markdown
3. 先只存在浏览器 localStorage
```

Default: local JSON for Electron apps; localStorage for simple web prototypes.

### 状态面板

Ask:

```markdown
状态面板显示什么？

1. 今日待办数量
2. 一个本地脚本的最近结果
3. 一个服务或网页入口状态
4. 一个手动填写的状态
```

Keep refresh manual or low-frequency in MVP.

### 本地脚本

Ask:

```markdown
本地脚本会执行命令，有风险。第一版建议只做 harmless 命令。

选脚本类型：
1. 打开项目
2. 运行检查
3. 同步文件
4. 自定义命令
```

Require explicit confirmation before implementation.

## Step 6: Generate MVP Spec

After choices are known, output:

```markdown
**第一版光岛**
| 模块 | 类型 | 动作 | 权限 | 验收 |
| --- | --- | --- | --- | --- |

**本地配置**
- modules stored in ...
- variables stored in ...
- private data policy ...

**实现路线**
1. ...
2. ...
3. ...

**验收**
1. ...
2. ...
3. ...
```

Then start building if the user asked for implementation.

## Fallback Defaults

When the user wants speed, choose:

- name: `工作光岛`
- module count: 3
- modules:
  1. `发帖子`: open a placeholder publishing URL or draft folder, removable
  2. `快捷入口`: open a placeholder project or URL, removable
  3. `待办记录`: add a local todo
- storage: local JSON or localStorage
- platform: Electron/macOS if desktop behavior is needed; browser prototype if the user only needs a demo
